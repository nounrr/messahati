<template>
  <div v-if="showNotification" class="notification-container">
    <div class="notification" :class="notificationClass">
      <div class="notification-content">
        <h3>Nouveau message</h3>
        <p><strong>{{ senderName }}</strong> vous a envoyé un message</p>
        <p class="message-content">{{ messageContent }}</p>
      </div>
      <button @click="closeNotification" class="close-button">×</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showNotification: false,
      senderName: '',
      messageContent: '',
      notificationClass: 'slide-in'
    }
  },
  mounted() {
    // Écouter les événements Pusher
    window.Echo.private('chat-channel')
      .listen('message.sent', (data) => {
        this.showNotification = true;
        this.senderName = data.sender_name;
        this.messageContent = data.content;
        
        // Fermer automatiquement après 5 secondes
        setTimeout(() => {
          this.closeNotification();
        }, 5000);
      });
  },
  methods: {
    closeNotification() {
      this.notificationClass = 'slide-out';
      setTimeout(() => {
        this.showNotification = false;
        this.notificationClass = 'slide-in';
      }, 300);
    }
  }
}
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
}

.notification {
  background: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  min-width: 300px;
  max-width: 400px;
}

.notification-content {
  flex: 1;
}

.notification-content h3 {
  margin: 0 0 10px 0;
  color: #333;
}

.notification-content p {
  margin: 5px 0;
  color: #666;
}

.message-content {
  font-style: italic;
  color: #888;
}

.close-button {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #999;
  padding: 0;
  margin-left: 10px;
}

.slide-in {
  animation: slideIn 0.3s ease-out;
}

.slide-out {
  animation: slideOut 0.3s ease-in;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOut {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}
</style> 