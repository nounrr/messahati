<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;

class NotificationUser extends Pivot
{
    protected $table = 'notification_users'; 
    protected $fillable = [
        'notification_id',
        'user_id',
        'message',
        'statut'
    ];

    public function notification()
    {
        return $this->belongsTo(Notification::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}