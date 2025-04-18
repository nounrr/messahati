<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TypePartenaire extends Model
{
    protected $table = 'type_partenaires';
    
    public function partenaires(){
        return $this->hasMany(Partenaire::class);
    }
}
