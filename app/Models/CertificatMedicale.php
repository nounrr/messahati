<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CertificatMedicale extends Model
{
    use HasFactory;
    protected $fillable = ['description','date_emission'];

    public function traitement(){
        return $this->belongsTo(Traitement::class);
    }
    public function typeCertificat(){
        return $this->belongsTo(TypeCertificat::class);
    }
}
