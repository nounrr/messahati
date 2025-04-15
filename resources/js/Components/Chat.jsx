import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Chat = () => {
    const { userId } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        // Charger les messages existants
        loadMessages();
    }, [userId]);

    const loadMessages = async () => {
        try {
            const response = await axios.get(`/api/chat/messages/${userId}`);
            setMessages(response.data);
        } catch (error) {
            console.error('Erreur lors du chargement des messages:', error);
        }
    };

    const sendMessage = async () => {
        if (!newMessage.trim()) return;

        try {
            const response = await axios.post('/api/chat/send', {
                message: newMessage,
                destinataire_id: userId
            });
            setMessages([...messages, response.data]);
            setNewMessage('');
        } catch (error) {
            console.error('Erreur lors de l\'envoi du message:', error);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Chat avec l'utilisateur {userId}</h1>
            
            <div className="bg-white rounded-lg shadow-md p-4 mb-4 h-96 overflow-y-auto">
                {messages.map((msg, index) => (
                    <div key={index} className="mb-2">
                        <strong>{msg.user_name}: </strong>
                        {msg.content}
                    </div>
                ))}
            </div>

            <div className="flex space-x-2">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Tapez votre message..."
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button
                    onClick={sendMessage}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                    Envoyer
                </button>
            </div>
        </div>
    );
};

export default Chat; 