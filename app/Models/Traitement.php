<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Traitement extends Model
{
    use HasFactory;

    protected $fillable = [
        'description',
        'date_debut',
        'date_fin',
        'patient_id',
        'medecin_id',
        'status'
    ];

    protected $casts = [
        'date_debut' => 'datetime',
        'date_fin' => 'datetime'
    ];

    public function patient()
    {
        return $this->belongsTo(User::class, 'patient_id');
    }

    public function medecin()
    {
        return $this->belongsTo(User::class, 'medecin_id');
    }

    public function ordonances()
    {
        return $this->hasMany(Ordonance::class);
    }

    public function certificatMedicales(){
        return $this->hasMany(CertificatMedicale::class);
    }

    /**
     * Relation avec le modèle Document.
     */
    public function documents()
    {
        return $this->hasMany(Document::class);
    }
}
