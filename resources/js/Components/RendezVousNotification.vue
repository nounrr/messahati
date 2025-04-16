<template>
  <div v-if="show" class="notification-container">
    <div class="notification" :class="notificationClass">
      <div class="notification-header">
        <span class="notification-type">{{ notificationType }}</span>
        <button @click="closeNotification" class="close-button">&times;</button>
      </div>
      <div class="notification-content">
        <p>{{ message }}</p>
        <div v-if="changes" class="changes">
          <p v-for="(change, field) in changes" :key="field">
            {{ formatFieldName(field) }} : {{ formatChange(change) }}
          </p>
        </div>
        <p v-if="reason" class="reason">Raison : {{ reason }}</p>
      </div>
      <div class="notification-footer">
        <small>{{ formattedDate }}</small>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      message: '',
      type: 'created', // created, updated, cancelled
      changes: null,
      reason: null,
      date: null
    }
  },
  computed: {
    notificationClass() {
      return {
        'notification-created': this.type === 'created',
        'notification-updated': this.type === 'updated',
        'notification-cancelled': this.type === 'cancelled'
      }
    },
    notificationType() {
      const types = {
        'created': 'Nouveau Rendez-vous',
        'updated': 'Rendez-vous Modifié',
        'cancelled': 'Rendez-vous Annulé'
      }
      return types[this.type] || 'Notification'
    },
    formattedDate() {
      return this.date ? new Date(this.date).toLocaleString() : ''
    }
  },
  mounted() {
    window.Echo.private('rendez-vous-channel')
      .listen('RendezVousCreated', (data) => {
        this.showNotification('created', data)
      })
      .listen('RendezVousUpdated', (data) => {
        this.showNotification('updated', data)
      })
      .listen('RendezVousCancelled', (data) => {
        this.showNotification('cancelled', data)
      })
  },
  methods: {
    showNotification(type, data) {
      this.type = type
      this.message = this.getMessage(type, data)
      this.changes = data.changes || null
      this.reason = data.reason || null
      this.date = data.created_at
      this.show = true
      
      setTimeout(() => {
        this.closeNotification()
      }, 5000)
    },
    getMessage(type, data) {
      const messages = {
        'created': `Nouveau rendez-vous avec ${data.doctor_name} le ${data.date_heure}`,
        'updated': `Modification du rendez-vous avec ${data.doctor_name} le ${data.date_heure}`,
        'cancelled': `Annulation du rendez-vous avec ${data.doctor_name} le ${data.date_heure}`
      }
      return messages[type] || 'Notification de rendez-vous'
    },
    closeNotification() {
      this.show = false
      this.message = ''
      this.changes = null
      this.reason = null
      this.date = null
    },
    formatFieldName(field) {
      const fieldNames = {
        'date_heure': 'Date et heure',
        'departement_id': 'Département',
        'traitement_id': 'Traitement',
        'statut': 'Statut'
      }
      return fieldNames[field] || field
    },
    formatChange(change) {
      if (typeof change.old === 'object' || typeof change.new === 'object') {
        return 'modifié'
      }
      return `de ${change.old} à ${change.new}`
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
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 15px;
  margin-bottom: 10px;
  width: 350px;
  animation: slideIn 0.3s ease-out;
}

.notification-created {
  border-left: 4px solid #4CAF50;
}

.notification-updated {
  border-left: 4px solid #2196F3;
}

.notification-cancelled {
  border-left: 4px solid #F44336;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.notification-type {
  font-weight: bold;
  font-size: 1.1em;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.2em;
  cursor: pointer;
  color: #666;
}

.notification-content {
  margin-bottom: 10px;
}

.changes {
  margin-top: 10px;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 4px;
}

.changes p {
  margin: 5px 0;
  font-size: 0.9em;
}

.reason {
  margin-top: 10px;
  font-style: italic;
  color: #666;
}

.notification-footer {
  font-size: 0.8em;
  color: #666;
  text-align: right;
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
</style> 