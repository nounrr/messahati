<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CertificatMedicale extends Model
{
    protected $fillable = ['description','date_emission'];

    public function traitement(){
        return $this->belongsTo(Traitement::class);
    }
    public function Typecertificat(){
        return $this->belongsTo(TypeCertificat::class);
    }
}
