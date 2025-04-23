<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TypeCertificat extends Model
{
    use HasFactory;


    protected $fillable = ['type_certificat','description'];

    public function certificatMedicales(){
        return $this->hasMany(CertificatMedicale::class);
    }

}
