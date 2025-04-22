<?php

namespace App\Services;

use Pusher\Pusher;
use Illuminate\Support\Facades\Log;

class PusherService
{
    protected $pusher;

    public function __construct()
    {
        $options = [
            'cluster' => env('PUSHER_APP_CLUSTER', 'mt1'),
            'useTLS' => true,
            'curl_options' => [
                CURLOPT_SSL_VERIFYHOST => 0,
                CURLOPT_SSL_VERIFYPEER => 0,
            ]
        ];

        $this->pusher = new Pusher(
            env('PUSHER_APP_KEY'),
            env('PUSHER_APP_SECRET'),
            env('PUSHER_APP_ID'),
            $options
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
        try {
            return $this->pusher->trigger("user.{$userId}", $event, $data);
        } catch (\Exception $e) {
            Log::error('Pusher error: ' . $e->getMessage());
            return false;
        }
    }

    public function sendToAll($event, $data)
    {
        return $this->pusher->trigger('public', $event, $data);
    }

    public function sendToChannel($channel, $event, $data)
    {
        try {
            return $this->pusher->trigger($channel, $event, $data);
        } catch (\Exception $e) {
            Log::error('Pusher error: ' . $e->getMessage());
            return false;
        }
    }
} 