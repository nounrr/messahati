<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reclamation extends Model
{
    protected $fillable = [
        'titre',
        'description',
        'statut',
        'user_id',
    ];
    
    protected $casts = [
        'statut' => 'string',
    ];
    
    public function user(){
        return $this->belongsTo(User::class);
    }
}
