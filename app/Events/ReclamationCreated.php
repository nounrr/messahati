<?php

namespace App\Events;

use App\Models\Reclamation;
use App\Models\Notification;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ReclamationCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $reclamation;

    public function __construct(Reclamation $reclamation)
    {
        $this->reclamation = $reclamation;
    }

    public function broadcastOn()
    {
        return new PrivateChannel('reclamations.' . $this->reclamation->user_id);
    }

    public function broadcastWith()
    {
        try {
            // Créer une notification
            $notification = Notification::create([
                'date' => now(),
                'statut' => true,
                'type' => 'reclamation',
                'data' => [
                    'reclamation_id' => $this->reclamation->id,
                    'titre' => $this->reclamation->titre,
                    'description' => $this->reclamation->description,
                    'statut' => $this->reclamation->statut
                ]
            ]);

            // Attacher la notification à l'utilisateur
            $notification->users()->attach($this->reclamation->user_id, [
                'message' => "Une nouvelle réclamation a été créée : {$this->reclamation->titre}"
            ]);

            \Log::info('Notification créée avec succès', [
                'notification_id' => $notification->id,
                'user_id' => $this->reclamation->user_id
            ]);
        } catch (\Exception $e) {
            \Log::error('Erreur lors de la création de la notification', [
                'error' => $e->getMessage(),
                'reclamation_id' => $this->reclamation->id
            ]);
        }

        return [
            'id' => $this->reclamation->id,
            'titre' => $this->reclamation->titre,
            'description' => $this->reclamation->description,
            'statut' => $this->reclamation->statut,
            'user_id' => $this->reclamation->user_id,
            'created_at' => $this->reclamation->created_at
        ];
    }
} 