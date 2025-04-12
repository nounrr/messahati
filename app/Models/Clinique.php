<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Clinique extends Model
{
    protected $fillable=['nom','adresse','email','site_web','description','logo_path'];
    public function departements(){
        return $this->hasMany(Departement::class);
    }
    public function partenaires(){
        return $this->hasMany(Partenaire::class);
    }
    public function typepartenaire(){
        return $this->belongsTo(TypePartenaire::class);
    }
}
