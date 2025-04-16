<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Partenaire extends Model
{
    use HasFactory;

    protected $fillable=['nom','adress','telephone'];
    
   
    public function charges(){
        return $this->hasMany(Charge::class);
    }

    public function typePartenaire(){
        return $this->belongsTo(TypePartenaire::class);
    }
}
