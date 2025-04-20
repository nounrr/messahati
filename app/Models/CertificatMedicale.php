<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CertificatMedicale extends Model
{
    protected $table = 'certificats_medicale';
    protected $fillable = ['description','date_emission'];

    public function traitement(){
        return $this->belongsTo(Traitement::class);
    }
    public function typeCertificat(){
        return $this->belongsTo(TypeCertificat::class, 'typecertificat_id');
    }
}
