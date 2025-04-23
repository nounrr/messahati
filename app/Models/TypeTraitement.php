<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TypeTraitement extends Model
{
    use HasFactory;
    
    protected $fillable=['nom','prix-default'];

    public function traitements(){
        return $this->hasMany(Traitement::class);
    }
}

