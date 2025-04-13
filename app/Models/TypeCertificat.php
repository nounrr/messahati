<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TypeCertificat extends Model
{
    protected $fillable = ['type_certificat','description'];

    public function certificats(){
        return $this->hasMany(CertificatMedicale::class);
    }

}
