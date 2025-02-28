<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CertificatMedical extends Model
{
    use HasFactory;

    protected $fillable = ['description', 'date_emission',];

    public function type()
    {
        return $this->belongsTo(TypeCertificatMedical::class);
    }
    public function traitements()
    {
        return $this->hasMany(Traitement::class);
    }

    public function rendezVous()
    {
        return $this->hasMany(RendezVous::class);
    }
}

