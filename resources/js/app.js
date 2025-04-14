import './bootstrap';
import NotificationPopup from './components/NotificationPopup.vue';

// Écoute des messages privés
const userId = document.querySelector('meta[name="user-id"]')?.content;

if (userId) {
    // Écoute des messages
    window.Echo.private(`chat.${userId}`)
        .listen('message.sent', (e) => {
            console.log('Nouveau message reçu:', e);
            showNotification(e.message);
        });

    // Écoute des notifications
    window.Echo.private(`App.Models.User.${userId}`)
        .notification((notification) => {
            console.log('Nouvelle notification:', notification);
            showNotificationPopup(notification);
        });
}

function showNotificationPopup(notification) {
    // Créer un élément div pour le popup
    const popupContainer = document.createElement('div');
    document.body.appendChild(popupContainer);

    // Créer une instance du composant NotificationPopup
    const app = createApp(NotificationPopup, {
        notification: notification
    });

    // Monter le composant
    app.mount(popupContainer);

    // Supprimer le popup après sa fermeture
    setTimeout(() => {
        app.unmount();
        document.body.removeChild(popupContainer);
    }, 5000);
}

function showNotification(message) {
    if (!("Notification" in window)) {
        console.log("Ce navigateur ne supporte pas les notifications");
        return;
    }

    if (Notification.permission === "granted") {
        createNotification(message);
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                createNotification(message);
            }
        });
    }
}

function createNotification(message) {
    const notification = new Notification("Nouveau message", {
        body: `${message.user_name}: ${message.content}`,
        icon: "/images/notification-icon.png"
    });

    notification.onclick = function() {
        window.focus();
        this.close();
    };
} 