<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TypeCertificatMedical extends Model
{
    use HasFactory;
    protected $fillable = ['nom', 'description'];

    public function certificats()
    {
        return $this->hasMany(CertificatMedical::class);
    }
}
