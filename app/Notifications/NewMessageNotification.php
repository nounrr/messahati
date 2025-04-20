<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

class NewMessageNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $message;

    /**
     * Create a new notification instance.
     */
    public function __construct($message)
    {
        $this->message = $message;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via($notifiable)
    {
        return ['database', 'broadcast'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
                    ->line('The introduction to the notification.')
                    ->action('Notification Action', url('/'))
                    ->line('Thank you for using our application!');
    }

    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage([
            'id' => $this->message->id,
            'content' => $this->message->contenu,
            'sender_id' => $this->message->emetteure_id,
            'sender_name' => $this->message->emetteure->name,
            'created_at' => $this->message->created_at->toDateTimeString()
        ]);
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function broadcastType()
    {
        return 'new.message';
    }

    public function toArray($notifiable)
    {
        return [
            'id' => $this->message->id,
            'content' => $this->message->contenu,
            'sender_id' => $this->message->emetteure_id,
            'sender_name' => $this->message->emetteure->name,
            'created_at' => $this->message->created_at->toDateTimeString()
        ];
    }
}
