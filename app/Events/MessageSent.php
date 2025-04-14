<?php
namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Support\Facades\Log;

class MessageSent implements ShouldBroadcast
{
    use Dispatchable, SerializesModels, InteractsWithSockets;

    public $message;
    public $user;

    /**
     * Créer une nouvelle instance d'événement.
     *
     * @param $message
     * @param $user
     */
    public function __construct($message, $user)
    {
        $this->message = $message;
        $this->user = $user;
    }

    /**
     * Les canaux sur lesquels l'événement doit être diffusé.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new Channel('chat.'.$this->message['destinataire_id']);
    }

    public function broadcastAs()
    {
        return 'message.sent';
    }

    /**
     * Les données à diffuser avec l'événement.
     *
     * @return array
     */
    public function broadcastWith()
    {
        return [
            'message' => [
                'id' => $this->message['emetteur_id'],
                'content' => $this->message['content'],
                'user_name' => $this->message['user_name'],
                'timestamp' => $this->message['timestamp'],
            ],
            'user' => [
                'id' => $this->user,
                'name' => $this->message['user_name']
            ]
        ];
    }
}
