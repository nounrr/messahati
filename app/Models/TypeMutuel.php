<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TypeMutuel extends Model
{
    use HasFactory;

    protected $fillable = ['nom', 'description'];

    public function mutuels()
    {
        return $this->hasMany(Mutuel::class);
    }

 
}
