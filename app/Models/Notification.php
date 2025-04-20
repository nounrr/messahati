<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $fillable = [
        'date',
        'statut',
        'type',
        'data'
    ];

    protected $casts = [
        'data' => 'array',
        'date' => 'datetime',
        'statut' => 'boolean'
    ];

    public $timestamps = true;

    public function users()
    {
        return $this->belongsToMany(User::class, 'notification_users')
            ->withPivot('message')
            ->withTimestamps();
    }
}
