import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

// Fetch user notifications
export const fetchNotifications = createAsyncThunk(
    'notifications/fetchNotifications',
    async (_, { getState }) => {
        const userId = getState().auth.user?.id;
        if (!userId) {
            throw new Error('User not authenticated');
        }

        try {
            const response = await axiosInstance.get(`/notifications/user/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Accept': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching notifications:', error);
            throw error;
        }
    }
);

// Mark notification as read
export const markNotificationAsRead = createAsyncThunk(
    'notifications/markAsRead',
    async (notificationId, { getState }) => {
        const userId = getState().auth.user?.id;
        if (!userId) {
            throw new Error('User not authenticated');
        }

        try {
            const response = await axiosInstance.post(`/notifications/${notificationId}/markasread`, {
                user_id: userId
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Accept': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error marking notification as read:', error);
            throw error;
        }
    }
);

// Delete notification
export const deleteNotification = createAsyncThunk(
    'notifications/deleteNotification',
    async (notificationId, { getState }) => {
        const userId = getState().auth.user?.id;
        if (!userId) {
            throw new Error('User not authenticated');
        }

        try {
            const response = await axiosInstance.delete(`/notifications/${notificationId}`, {
                data: { user_id: userId },
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Accept': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error deleting notification:', error);
            throw error;
        }
    }
);

// Create new notifications
export const createNotifications = createAsyncThunk(
    'notifications/createNotifications',
    async (notifications, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            notifications.forEach((notification, index) => {
                Object.entries(notification).forEach(([key, value]) => {
                    if (key === 'image' && value instanceof File) {
                        formData.append(`notifications[${index}][image]`, value);
                    } else {
                        formData.append(`notifications[${index}][${key}]`, value);
                    }
                });
            });

            const response = await axiosInstance.post('/notifications', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Update existing notifications
export const updateNotifications = createAsyncThunk(
    'notifications/updateNotifications',
    async (notifications, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            notifications.forEach((notification, index) => {
                Object.entries(notification).forEach(([key, value]) => {
                    if (key === 'image' && value instanceof File) {
                        formData.append(`notifications[${index}][image]`, value);
                    } else {
                        formData.append(`notifications[${index}][${key}]`, value);
                    }
                });
            });

            const response = await axiosInstance.put('/notifications', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Delete notifications
export const deleteNotifications = createAsyncThunk(
    'notifications/deleteNotifications',
    async (ids, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete('/notifications', { data: { ids } });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Export notifications
export const exportNotifications = createAsyncThunk(
    'notifications/exportNotifications',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/notifications/export', {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'notifications.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Import notifications
export const importNotifications = createAsyncThunk(
    'notifications/importNotifications',
    async (file, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await axiosInstance.post('/notifications/import', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const notificationSlice = createSlice({
    name: 'notifications',
    initialState: {
        items: [],
        status: 'idle',
        error: null,
    },
    reducers: {
        // Action pour ajouter une nouvelle notification reçue via Pusher
        addNotification: (state, action) => {
            state.items.unshift(action.payload);
        },
        // Action pour initialiser Echo/Pusher
        initializePusher: (state, action) => {
            const userId = action.payload;
            if (window.Echo) {
                window.Echo.private(`notifications.${userId}`)
                    .listen('NotificationCreated', (e) => {
                        console.log('Notification PUSHER reçue 🎉:', e); // <-- ajoute ceci

                        state.items.unshift(e.notification);
                    });
                    window.Echo.private('rendez-vous-channel')
            .listen('RendezVousCreated', (e) => {
                console.log('📅 Rendez-vous reçu via Pusher :', e);
                state.items.unshift(e.notification);

                // tu peux ajouter ici une logique pour stocker les rendez-vous dans Redux
            });
            }
            
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(createNotifications.fulfilled, (state, action) => {
                state.items.push(...action.payload);
            })
            .addCase(createNotifications.rejected, (state, action) => {
                state.error = action.payload?.message || 'Erreur lors de la création';
            })
            .addCase(updateNotifications.fulfilled, (state, action) => {
                action.payload.forEach((updated) => {
                    const index = state.items.findIndex((item) => item.id === updated.id);
                    if (index !== -1) {
                        state.items[index] = updated;
                    }
                });
            })
            .addCase(deleteNotifications.fulfilled, (state, action) => {
                state.items = state.items.filter((item) => !action.payload.ids.includes(item.id));
            })
            .addCase(importNotifications.fulfilled, (state, action) => {
                state.items.push(...action.payload);
            })
            .addCase(markNotificationAsRead.fulfilled, (state, action) => {
                const index = state.items.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(deleteNotification.fulfilled, (state, action) => {
                state.items = state.items.filter(item => item.id !== action.payload.id);
            });
    },
});

export const { addNotification, initializePusher } = notificationSlice.actions;
export default notificationSlice.reducer; 