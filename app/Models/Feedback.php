<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Feedback extends Model
{
    protected $fillable = [
        'titre',
        'contenu',
        'note',
        'statut',
        'user_id'
    ];

    protected $casts = [
        'note' => 'integer',
        'statut' => 'string'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }
}
