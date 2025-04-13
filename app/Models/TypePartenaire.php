<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TypePartenaire extends Model
{
    protected $fillable=['nom'];
    public function partenaires(){
        return $this->hasMany(Partenaire::class);
    }
}
