<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Medicament;
use App\Models\Traitement;
use App\Models\User;

class Ordonance extends Model
{
    use HasFactory;

    protected $fillable = [
        'date_expiration',
        'description',
        'traitement_id'
    ];

    protected $with = ['traitement', 'traitement.patient', 'traitement.medecin'];

    public function traitement()
    {
        return $this->belongsTo(Traitement::class);
    }

    public function medicaments()
    {
        return $this->belongsToMany(Medicament::class, 'ordonances_medicaments')
            ->withPivot('posologie')
            ->withTimestamps();
    }

    public function patient()
    {
        return $this->belongsTo(User::class, 'patient_id');
    }

    public function medecin()
    {
        return $this->belongsTo(User::class, 'medecin_id');
    }
}
