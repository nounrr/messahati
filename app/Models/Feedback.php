<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Feedback extends Model
{
    // Specify the table name explicitly
    protected $table = 'feedbacks';

    protected $fillable = [
        'contenu',
        'rating',
        'status',
        'user_id'
    ];

    protected $casts = [
        'rating' => 'integer',
        'status' => 'boolean'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }
}
