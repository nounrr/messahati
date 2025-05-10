<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RendezVous extends Model
{
    use HasFactory;

    protected $table = 'rendez_vous';

    protected $fillable = [
        'patient_id',
        'docteur_id',
        'departement_id',
        'traitement_id',
        'date_heure',
        'motif',
        'notes',
        'statut'
    ];

    protected $casts = [
        'date_heure' => 'datetime'
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
