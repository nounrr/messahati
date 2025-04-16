<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $fillable = [
        'date',
        'statut'
    ];

    public function users()
    {
        return $this->belongsToMany(User::class, 'notification_users')
            ->withPivot('message')
            ->withTimestamps();
    }
}
