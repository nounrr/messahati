import React, { useState } from 'react';
import axios from 'axios';

const TestNotification = () => {
    const [message, setMessage] = useState('');
    const [destinataireId, setDestinataireId] = useState('');

    const sendTestMessage = async () => {
        try {
            const response = await axios.post('/api/chat/send', {
                message: message,
                destinataire_id: destinataireId
            });
            console.log('Message de test envoyé:', response.data);
            setMessage('');
        } catch (error) {
            console.error('Erreur lors de l\'envoi du message:', error);
        }
    };

    const testNotification = () => {
        if (Notification.permission === "granted") {
            new Notification("Test de notification", {
                body: "Ceci est un test de notification",
                icon: "/images/notification-icon.png"
            });
        } else {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    new Notification("Test de notification", {
                        body: "Ceci est un test de notification",
                        icon: "/images/notification-icon.png"
                    });
                }
            });
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto bg-white rounded-xl shadow-md">
            <h2 className="text-xl font-bold mb-4">Test des Notifications</h2>
            
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    ID du destinataire
                </label>
                <input
                    type="text"
                    value={destinataireId}
                    onChange={(e) => setDestinataireId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Entrez l'ID du destinataire"
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                </label>
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Entrez votre message"
                    rows="3"
                />
            </div>

            <div className="space-x-2">
                <button
                    onClick={sendTestMessage}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                    Envoyer un message
                </button>

                <button
                    onClick={testNotification}
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                >
                    Tester la notification
                </button>
            </div>
        </div>
    );
};

export default TestNotification; 