import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    setSelectedUser, 
    toggleProfile, 
    sendMessage, 
    fetchSentMessages, 
    fetchReceivedMessages,
    initializeWebSocket,
    clearMessages,
    fetchUsers
} from '../../../Redux/chat/chatSlice';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Swal from 'sweetalert2';
import { router } from '@inertiajs/react';

const ChatMessageLayer = ({ isMinimized = false }) => {
    const dispatch = useDispatch();
    const messagesEndRef = useRef(null);
    const messageInputRef = useRef(null);

    const { 
        selectedUser, 
        showProfile, 
        sentMessages, 
        receivedMessages, 
        status,
        isConnected,
        users
    } = useSelector(state => state.chat);

    const currentUser = useSelector(state => state.auth.user);
    console.log('Current user:', currentUser);

    // Vérification de l'authentification
    useEffect(() => {
        console.log('Checking authentication...');
        if (!currentUser) {
            console.log('No current user, redirecting to login');
            router.get('/login');
            return;
        }
    }, [currentUser]);

    // Initialiser la connexion WebSocket
    useEffect(() => {
        console.log('Initializing WebSocket...');
        if (currentUser) {
            try {
                const cleanup = dispatch(initializeWebSocket());
                console.log('WebSocket initialized');
                
                window.Echo.connector.pusher.connection.bind('connected', () => {
                    console.log('Connected to Pusher!');
                });

                window.Echo.connector.pusher.connection.bind('disconnected', () => {
                    console.log('Disconnected from Pusher!');
                });

                window.Echo.connector.pusher.connection.bind('error', (error) => {
                    console.error('Pusher error:', error);
                });

                return () => {
                    cleanup();
                    dispatch(clearMessages());
                };
            } catch (error) {
                console.error('Error initializing WebSocket:', error);
            }
        }
    }, [dispatch, currentUser]);

    // Charger les utilisateurs au chargement du composant
    useEffect(() => {
        console.log('Fetching users...');
        if (currentUser) {
            dispatch(fetchUsers())
                .then(() => console.log('Users fetched successfully'))
                .catch(error => console.error('Error fetching users:', error));
        }
    }, [dispatch, currentUser]);

    // Charger les messages lorsqu'un utilisateur est sélectionné
    useEffect(() => {
        if (selectedUser && currentUser) {
            dispatch(fetchSentMessages(selectedUser.id));
            dispatch(fetchReceivedMessages(selectedUser.id));
        }
    }, [dispatch, selectedUser, currentUser]);

    // Défiler vers le bas lors de nouveaux messages
    useEffect(() => {
        scrollToBottom();
    }, [sentMessages, receivedMessages]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            // Rediriger vers la page de connexion
            window.location.href = '/login';
        }
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        const message = messageInputRef.current.value.trim();
        
        if (message && selectedUser) {
            try {
                await dispatch(sendMessage({ 
                    receiver_id: selectedUser.id, 
                    message 
                })).unwrap();
                messageInputRef.current.value = '';
            } catch (error) {
                console.error('Erreur d\'envoi du message:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Erreur',
                    text: 'Impossible d\'envoyer le message. Veuillez réessayer.',
                    confirmButtonText: 'OK'
                });
            }
        }
    };

    const handleUserSelect = (user) => {
        dispatch(setSelectedUser(user));
    };

    const handleToggleProfile = () => {
        dispatch(toggleProfile());
    };

    // Ajustement du style pour le mode minimisé
    const containerClass = isMinimized 
        ? "flex flex-col h-full" 
        : "flex h-full";
    
    const userListClass = isMinimized 
        ? "h-24 overflow-y-auto border-b border-gray-200 p-2" 
        : "w-1/4 border-r border-gray-200 p-4";
    
    const chatAreaClass = isMinimized 
        ? "flex-1 flex flex-col" 
        : "flex-1 flex flex-col";
    
    const profileAreaClass = isMinimized 
        ? "border-t border-gray-200 p-2 h-32 overflow-y-auto" 
        : "w-1/4 border-l border-gray-200 p-4";

    return (
        <div className={containerClass}>
            {/* Liste des utilisateurs */}
            <div className={userListClass}>
                <h2 className={`${isMinimized ? "text-sm" : "text-lg"} font-semibold mb-2`}>Conversations</h2>
                <div className={`${isMinimized ? "flex overflow-x-auto" : "space-y-2"}`}>
                    {users.map(user => (
                        <div 
                            key={user.id}
                            className={`${isMinimized ? "p-1 mr-2" : "p-3"} rounded-lg cursor-pointer hover:bg-gray-100 ${selectedUser?.id === user.id ? 'bg-blue-50' : ''}`}
                            onClick={() => handleUserSelect(user)}
                        >
                            <div className={`${isMinimized ? "" : "space-x-3"} flex items-center`}>
                                <img 
                                    src={user.avatar || '/default-avatar.png'} 
                                    alt={user.name}
                                    className={`${isMinimized ? "w-6 h-6" : "w-10 h-10"} rounded-full`}
                                />
                                {!isMinimized && (
                                    <div>
                                        <h3 className="font-medium">{user.name}</h3>
                                        <p className="text-sm text-gray-500">
                                            {user.status || 'En ligne'}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Zone de chat */}
            <div className={chatAreaClass}>
                {selectedUser ? (
                    <>
                        {/* En-tête du chat */}
                        <div className="p-2 border-b border-gray-200 flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                                <img 
                                    src={selectedUser.avatar || '/default-avatar.png'} 
                                    alt={selectedUser.name}
                                    className={`${isMinimized ? "w-6 h-6" : "w-10 h-10"} rounded-full`}
                                />
                                <div>
                                    <h3 className={`${isMinimized ? "text-sm" : "text-base"} font-semibold`}>{selectedUser.name}</h3>
                                    {!isMinimized && (
                                        <p className="text-sm text-gray-500">
                                            {selectedUser.status || 'En ligne'}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={handleToggleProfile}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <i className={`fas fa-user-circle ${isMinimized ? "text-base" : "text-xl"}`}></i>
                            </button>
                        </div>

                        {/* Messages */}
                        <div className={`flex-1 overflow-y-auto ${isMinimized ? "p-2" : "p-4"} space-y-3`}>
                            {[...sentMessages, ...receivedMessages]
                                .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
                                .map((message) => (
                                    <div 
                                        key={message.id}
                                        className={`flex ${message.emetteure_id === currentUser.id ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`${isMinimized ? "max-w-[80%]" : "max-w-[70%]"} ${message.emetteure_id === currentUser.id ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}>
                                            <div className={`${isMinimized ? "p-2" : "p-3"} rounded-lg`}>
                                                <p className={isMinimized ? "text-sm" : ""}>{message.contenu}</p>
                                                <span className="text-xs opacity-75">
                                                    {format(new Date(message.created_at), 'HH:mm', { locale: fr })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Formulaire d'envoi de message */}
                        <form onSubmit={handleSendMessage} className={`${isMinimized ? "p-2" : "p-4"} border-t border-gray-200`}>
                            <div className="flex space-x-2">
                                <input
                                    ref={messageInputRef}
                                    type="text"
                                    placeholder="Écrivez votre message..."
                                    className={`flex-1 border border-gray-300 rounded-lg ${isMinimized ? "px-2 py-1 text-sm" : "px-4 py-2"} focus:outline-none focus:border-blue-500`}
                                    disabled={!isConnected}
                                />
                                <button
                                    type="submit"
                                    disabled={status === 'loading' || !isConnected}
                                    className={`bg-blue-500 text-white ${isMinimized ? "px-2 py-1" : "px-4 py-2"} rounded-lg hover:bg-blue-600 focus:outline-none disabled:opacity-50`}
                                >
                                    <i className="fas fa-paper-plane"></i>
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500">
                        <p className={isMinimized ? "text-sm" : ""}>Sélectionnez une conversation pour commencer</p>
                    </div>
                )}
                </div>

            {/* Profil utilisateur */}
            {showProfile && selectedUser && !isMinimized && (
                <div className={profileAreaClass}>
                    <div className="text-center">
                        <img 
                            src={selectedUser.avatar || '/default-avatar.png'} 
                            alt={selectedUser.name}
                            className="w-24 h-24 rounded-full mx-auto mb-4"
                        />
                        <h3 className="text-xl font-semibold">{selectedUser.name}</h3>
                        <p className="text-gray-500">{selectedUser.email}</p>
                    </div>
                    <div className="mt-6">
                        <h4 className="font-semibold mb-2">Statut</h4>
                        <p className="text-gray-600">{selectedUser.status || 'En ligne'}</p>
                    </div>
                    <div className="mt-6">
                        <h4 className="font-semibold mb-2">Membre depuis</h4>
                        <p className="text-gray-600">
                            {format(new Date(selectedUser.created_at), 'dd MMMM yyyy', { locale: fr })}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatMessageLayer;