<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TypeTraitement extends Model
{
    protected $fillable=['nom','prix-default'];

    public function traitements(){
        return $this->hasMany(Traitement::class);
    }
}
