<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rendezvous extends Model
{
    protected $table = 'rendez_vous';

    protected $fillable = [
        'patient_id',
        'docteur_id',
        'departement_id',
        'traitement_id',
        'date_heure',
        'statut'
    ];

    public function patient()
    {
        return $this->belongsTo(User::class, 'patient_id');
    }

    public function docteur()
    {
        return $this->belongsTo(User::class, 'docteur_id');
    }

    public function departement()
    {
        return $this->belongsTo(Departement::class);
    }

    public function payment()
    {
        return $this->hasOne(Payment::class);
    }

    public function traitement()
    {
        return $this->belongsTo(Traitement::class);
    }
}
