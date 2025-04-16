<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TypePartenaire extends Model
{
    use HasFactory;

    public function partenaires(){
        return $this->hasMany(Partenaire::class);
    }
}
