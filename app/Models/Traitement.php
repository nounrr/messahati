<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Traitement extends Model
{
    use HasFactory;

    // Existing code remains unchanged
    protected $fillable=['description','date_debut','date_fin'];
    public function rendezvous(){
        return $this->hasMany(Rendezvous::class);
    }
    public function ordonances(){
        return $this->hasMany(Ordonance::class);
    }
    public function typetraitement(){
        return $this->belongsTo(TypeTraitement::class);
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
