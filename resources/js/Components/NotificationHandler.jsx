import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NotificationHandler = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Demander la permission pour les notifications
        if (!("Notification" in window)) {
            console.log("Ce navigateur ne supporte pas les notifications");
            return;
        }

        if (Notification.permission !== "granted" && Notification.permission !== "denied") {
            Notification.requestPermission();
        }

        // Écoute des messages
        const userId = document.querySelector('meta[name="user-id"]')?.content;
        if (userId) {
            window.Echo.private(`chat.${userId}`)
                .listen('message.sent', (e) => {
                    showNotification(
                        'Nouveau message',
                        `${e.message.user_name}: ${e.message.content}`,
                        `/chat/${e.message.emetteur_id}`
                    );
                });
        }

        return () => {
            // Nettoyage lors du démontage du composant
            if (window.Echo) {
                window.Echo.leave(`chat.${userId}`);
            }
        };
    }, []);

    const showNotification = (title, body, redirectUrl) => {
        if (Notification.permission === "granted") {
            const notification = new Notification(title, {
                body: body,
                icon: "/images/notification-icon.png"
            });

            notification.onclick = () => {
                navigate(redirectUrl);
                notification.close();
            };
        }
    };

    return null; 
};

export default NotificationHandler; 