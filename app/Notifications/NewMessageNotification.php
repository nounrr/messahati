<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\BroadcastMessage;

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

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray($notifiable)
    {
        return [
            'type' => 'new_message',
            'title' => 'Nouveau message',
            'message' => [
                'id' => $this->message['emetteur_id'],
                'content' => $this->message['content'],
                'user_name' => $this->message['user_name'],
                'timestamp' => $this->message['timestamp'],
            ],
            'icon' => 'message',
            'sound' => 'default',
            'click_action' => '/chat/' . $this->message['emetteur_id']
        ];
    }

    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage([
            'type' => 'new_message',
            'title' => 'Nouveau message',
            'message' => [
                'id' => $this->message['emetteur_id'],
                'content' => $this->message['content'],
                'user_name' => $this->message['user_name'],
                'timestamp' => $this->message['timestamp'],
            ],
            'icon' => 'message',
            'sound' => 'default',
            'click_action' => '/chat/' . $this->message['emetteur_id']
        ]);
    }
}
