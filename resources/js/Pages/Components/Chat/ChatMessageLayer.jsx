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

const ChatMessageLayer = () => {
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

    // Initialiser la connexion WebSocket
    useEffect(() => {
        const cleanup = dispatch(initializeWebSocket());
        return () => {
            cleanup();
            dispatch(clearMessages());
        };
    }, [dispatch]);

    // Charger les utilisateurs au chargement du composant
    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    // Charger les messages lorsqu'un utilisateur est sélectionné
    useEffect(() => {
        if (selectedUser) {
            dispatch(fetchSentMessages(selectedUser.id));
            dispatch(fetchReceivedMessages(selectedUser.id));
        }
    }, [dispatch, selectedUser]);

    // Défiler vers le bas lors de nouveaux messages
    useEffect(() => {
        scrollToBottom();
    }, [sentMessages, receivedMessages]);

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

    return (
        <div className="flex h-full">
            {/* Liste des utilisateurs */}
            <div className="w-1/4 border-r border-gray-200 p-4">
                <h2 className="text-lg font-semibold mb-4">Conversations</h2>
                <div className="space-y-2">
                    {users.map(user => (
                        <div 
                            key={user.id}
                            className={`p-3 rounded-lg cursor-pointer hover:bg-gray-100 ${selectedUser?.id === user.id ? 'bg-blue-50' : ''}`}
                            onClick={() => handleUserSelect(user)}
                        >
                            <div className="flex items-center space-x-3">
                                <img 
                                    src={user.avatar || '/default-avatar.png'} 
                                    alt={user.name}
                                    className="w-10 h-10 rounded-full"
                                />
                                <div>
                                    <h3 className="font-medium">{user.name}</h3>
                                    <p className="text-sm text-gray-500">
                                        {user.status || 'En ligne'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Zone de chat */}
            <div className="flex-1 flex flex-col">
                {selectedUser ? (
                    <>
                        {/* En-tête du chat */}
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                                <img 
                                    src={selectedUser.avatar || '/default-avatar.png'} 
                                    alt={selectedUser.name}
                                    className="w-10 h-10 rounded-full"
                                />
                                <div>
                                    <h3 className="font-semibold">{selectedUser.name}</h3>
                                    <p className="text-sm text-gray-500">
                                        {selectedUser.status || 'En ligne'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleToggleProfile}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <i className="fas fa-user-circle text-xl"></i>
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {[...sentMessages, ...receivedMessages]
                                .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
                                .map((message) => (
                                    <div 
                                        key={message.id}
                                        className={`flex ${message.emetteure_id === currentUser.id ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[70%] ${message.emetteure_id === currentUser.id ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}>
                                            <div className="p-3 rounded-lg">
                                                <p>{message.contenu}</p>
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
                        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                            <div className="flex space-x-2">
                                <input
                                    ref={messageInputRef}
                                    type="text"
                                    placeholder="Écrivez votre message..."
                                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                                    disabled={!isConnected}
                                />
                                <button
                                    type="submit"
                                    disabled={status === 'loading' || !isConnected}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none disabled:opacity-50"
                                >
                                    <i className="fas fa-paper-plane"></i>
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500">
                        <p>Sélectionnez une conversation pour commencer</p>
                    </div>
                )}
            </div>

            {/* Profil utilisateur */}
            {showProfile && selectedUser && (
                <div className="w-1/4 border-l border-gray-200 p-4">
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