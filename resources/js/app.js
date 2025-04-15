import './bootstrap';

// Écoute des messages privés
const userId = document.querySelector('meta[name="user-id"]')?.content;

if (userId) {
    // Écoute des messages
    window.Echo.private(`chat.${userId}`)
        .listen('message.sent', (e) => {
            console.log('Nouveau message reçu:', e);
            showNotification(
                'Nouveau message',
                `${e.message.user_name}: ${e.message.content}`,
                `/chat/${e.message.emetteur_id}` // URL de redirection
            );
        });

    // Écoute des notifications
    window.Echo.private(`App.Models.User.${userId}`)
        .notification((notification) => {
            console.log('Nouvelle notification:', notification);
            if (notification.type === 'message') {
                showNotification(
                    'Nouveau message',
                    `${notification.message.user_name}: ${notification.message.content}`,
                    `/chat/${notification.message.emetteur_id}`
                );
            }
        });
}

function showNotification(title, body, redirectUrl) {
    if (!("Notification" in window)) {
        console.log("Ce navigateur ne supporte pas les notifications");
        return;
    }

    if (Notification.permission === "granted") {
        createNotification(title, body, redirectUrl);
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                createNotification(title, body, redirectUrl);
            }
        });
    }
}

function createNotification(title, body, redirectUrl) {
    const notification = new Notification(title, {
        body: body,
        icon: "/images/notification-icon.png"
    });

    notification.onclick = function() {
        // Redirection vers l'URL spécifiée
        window.location.href = redirectUrl;
        // Fermer la notification
        this.close();
    };
} 