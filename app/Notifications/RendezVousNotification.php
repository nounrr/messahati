<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class RendezVousNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $rendezVous;
    protected $type;

    public function __construct($rendezVous, $type)
    {
        $this->rendezVous = $rendezVous;
        $this->type = $type;
    }

    public function via($notifiable)
    {
        return ['database', 'broadcast'];
    }

    public function toArray($notifiable)
    {
        return [
            'title' => $this->type === 'doctor' ? 'Nouveau rendez-vous' : 'Confirmation de rendez-vous',
            'message' => $this->type === 'doctor' 
                ? "Un nouveau rendez-vous a été pris pour le {$this->rendezVous->date} à {$this->rendezVous->heure}"
                : "Votre rendez-vous a été confirmé pour le {$this->rendezVous->date} à {$this->rendezVous->heure}",
            'type' => 'rendez_vous',
            'rendez_vous_id' => $this->rendezVous->id,
            'date' => $this->rendezVous->date,
            'heure' => $this->rendezVous->heure
        ];
    }
} 