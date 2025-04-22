<?php

namespace App\Services;

use Pusher\Pusher;

class PusherService
{
    protected $pusher;

    public function __construct()
    {
        $this->pusher = new Pusher(
            env('PUSHER_APP_KEY'),
            env('PUSHER_APP_SECRET'),
            env('PUSHER_APP_ID'),
            [
                'cluster' => env('PUSHER_APP_CLUSTER', 'mt1'),
                'useTLS' => false,
                'encrypted' => false,
                'host' => 'api-mt1.pusher.com',
                'port' => 80,
                'scheme' => 'http',
                'curl_options' => [
                    CURLOPT_SSL_VERIFYHOST => 0,
                    CURLOPT_SSL_VERIFYPEER => 0,
                ]
            ]
        );
    }

    public function sendNotification($channel, $event, $data)
    {
        return $this->pusher->trigger($channel, $event, $data);
    }

    public function sendMessage($channel, $event, $data)
    {
        return $this->pusher->trigger($channel, $event, $data);
    }

    public function sendToUser($userId, $event, $data)
    {
        return $this->pusher->trigger('user.' . $userId, $event, $data);
    }

    public function sendToAll($event, $data)
    {
        return $this->pusher->trigger('public', $event, $data);
    }
} 