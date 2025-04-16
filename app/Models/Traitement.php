<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Traitement extends Model
{
    use HasFactory;
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
}
