<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Traitement extends Model
{
    use HasFactory;

    protected $fillable = ['description', 'date_debut', 'date_fin'];

    public function type()
    {
        return $this->belongsTo(TypeTraitement::class);
    }
    public function certificatMedical()
    {
        return $this->belongsTo(CertificatMedical::class);
    }

    public function paiement()
    {
        return $this->hasOne(Paiement::class);
    }

    public function ordonnance()
    {
        return $this->belongsTo(Ordonnance::class);
    }
}

