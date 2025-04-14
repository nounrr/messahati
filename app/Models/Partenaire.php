<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Partenaire extends Model
{
    protected $fillable=['nom','adress','telephone'];
    
   
    public function charges(){
        return $this->hasMany(Charge::class);
    }
}
