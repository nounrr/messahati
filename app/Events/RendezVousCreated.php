<?php

namespace App\Events;

use App\Models\RendezVous;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class RendezVousCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $rendezVous;
    public $notifications;

    public function __construct(RendezVous $rendezVous)
    {
        $this->rendezVous = $rendezVous;
        $this->notifications = [
            'doctor' => [
                'title' => 'Nouveau rendez-vous',
                'message' => "Un nouveau rendez-vous a été pris pour le {$rendezVous->date} à {$rendezVous->heure}",
                'type' => 'rendez_vous'
            ],
            'patient' => [
                'title' => 'Confirmation de rendez-vous',
                'message' => "Votre rendez-vous a été confirmé pour le {$rendezVous->date} à {$rendezVous->heure}",
                'type' => 'rendez_vous'
            ],
            'nurse' => [
                'title' => 'Nouveau rendez-vous',
                'message' => "Un nouveau rendez-vous a été programmé pour le {$rendezVous->date} à {$rendezVous->heure}",
                'type' => 'rendez_vous'
            ]
        ];
    }

    public function broadcastOn()
    {
        return [
            new PrivateChannel('rendez-vous'),
            new PrivateChannel('user.' . $this->rendezVous->doctor_id),
            new PrivateChannel('user.' . $this->rendezVous->patient_id),
            new PrivateChannel('nurses')
        ];
    }
} 