<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $fillable = [
        'contenu',
        'date_envoie',
        'heure_envoie',
        'status',
    ];
    public function destinataire(){
        return $this->belongsTo(User::class,"destinataire_id");
    }
    public function emetteure(){
        return $this->belongsTo(User::class,"emetteure_id");
    }
}
