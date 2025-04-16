<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Rendezvous extends Model
{
    use HasFactory;
    protected $table = 'rendez_vous';
    protected $fillable = ['date_heure','statut'];
    public function patient(){
        return $this->belongsTo(User::class,"patient_id");
    }
    public function docteur(){
        return $this->belongsTo(User::class,"docteur_id");
    }
    public function departement(){
        return $this->belongsTo(Departement::class);
    }
    public function payment(){
        return $this->hasOne(Payment::class);
    }
    public function traitement(){
        return $this->belongsTo(Traitement::class);
    }

}
