<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Partenaire extends Model
{

    protected $fillable = [
        'nom',
        'adress',
        'telephone',
        'typepartenaires_id'
    ];

    
   
    public function charges(){
        return $this->hasMany(Charge::class);
    }

    public function type_partenaire(){
        return $this->belongsTo(TypePartenaire::class, 'typepartenaires_id');
    }
}
