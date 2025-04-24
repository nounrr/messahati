import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Echo from 'laravel-echo';

// Actions asynchrones
export const sendMessage = createAsyncThunk(
    'chat/sendMessage',
    async ({ receiver_id, message }, { getState }) => {
        const { auth } = getState();
        const response = await axios.post('/api/send-message', {
            message,
            destinataire_id: receiver_id,
            sender_id: auth.user.id
        });
        return response.data;
    }
);

export const fetchSentMessages = createAsyncThunk(
    'chat/fetchSentMessages',
    async (receiver_id) => {
        const response = await axios.get(`/api/messages/sent/${receiver_id}`);
        return response.data.messages;
    }
);

export const fetchReceivedMessages = createAsyncThunk(
    'chat/fetchReceivedMessages',
    async (sender_id) => {
        const response = await axios.get(`/api/messages/received/${sender_id}`);
        return response.data.messages;
    }
);

export const fetchUsers = createAsyncThunk(
    'chat/fetchUsers',
    async () => {
        const response = await axios.get('/api/users');
        return response.data;
    }
);

// État initial
const initialState = {
    selectedUser: null,
    showProfile: false,
    sentMessages: [],
    receivedMessages: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    isConnected: false,
    users: [],
    unreadMessages: 0,
    isOpen: false
};

// Slice
const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload;
        },
        toggleProfile: (state) => {
            state.showProfile = !state.showProfile;
        },
        clearMessages: (state) => {
            state.sentMessages = [];
            state.receivedMessages = [];
        },
        addMessage: (state, action) => {
            const message = action.payload;
            if (message.emetteure_id === state.selectedUser?.id) {
                state.receivedMessages.push(message);
            } else {
                state.sentMessages.push(message);
            }
        },
        setConnectionStatus: (state, action) => {
            state.isConnected = action.payload;
        },
        incrementUnreadMessages: (state) => {
            state.unreadMessages += 1;
        },
        resetUnreadMessages: (state) => {
            state.unreadMessages = 0;
        },
        setChatOpen: (state, action) => {
            state.isOpen = action.payload;
            if (action.payload) {
                state.unreadMessages = 0;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            // Send Message
            .addCase(sendMessage.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.sentMessages.push(action.payload);
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            // Fetch Sent Messages
            .addCase(fetchSentMessages.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchSentMessages.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.sentMessages = action.payload;
            })
            .addCase(fetchSentMessages.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            // Fetch Received Messages
            .addCase(fetchReceivedMessages.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchReceivedMessages.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.receivedMessages = action.payload;
            })
            .addCase(fetchReceivedMessages.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchUsers.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    }
});

// Middleware pour la connexion WebSocket
export const initializeWebSocket = () => (dispatch, getState) => {
    const token = localStorage.getItem('token');
    
    try {
        console.log('Initialisation WebSocket avec token:', token ? 'Token présent' : 'Token absent');
        
        const echo = new Echo({
            broadcaster: 'pusher',
            key: import.meta.env.VITE_PUSHER_APP_KEY,
            cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
            forceTLS: true,
            authEndpoint: '/broadcasting/auth',
            auth: {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        });

        const userId = localStorage.getItem('user_id');
        console.log('Écoute du canal pour l\'utilisateur ID:', userId);

        // Écouter les messages privés
        echo.private(`chat.${userId}`)
            .listen('MessageSent', (e) => {
                console.log('Message reçu via WebSocket:', e);
                dispatch(addMessage(e.message));
                
                // Vérifier si le chat est ouvert et si le message provient de l'utilisateur sélectionné
                const state = getState();
                const { selectedUser, isOpen } = state.chat;
                
                if (!isOpen || selectedUser?.id !== e.message.emetteure_id) {
                    dispatch(incrementUnreadMessages());
                }
            })
            .error((error) => {
                console.error('Erreur WebSocket:', error);
            });

        dispatch(setConnectionStatus(true));
        console.log('WebSocket initialisé avec succès');

        return () => {
            console.log('Nettoyage de la connexion WebSocket');
            echo.leave(`chat.${userId}`);
            dispatch(setConnectionStatus(false));
        };
    } catch (error) {
        console.error('Erreur lors de l\'initialisation WebSocket:', error);
        dispatch(setConnectionStatus(false));
        
        return () => {}; // Fonction de nettoyage vide
    }
};

export const { 
    setSelectedUser, 
    toggleProfile, 
    clearMessages, 
    addMessage, 
    setConnectionStatus,
    incrementUnreadMessages,
    resetUnreadMessages,
    setChatOpen
} = chatSlice.actions;

export default chatSlice.reducer; 