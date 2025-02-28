<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mutuel extends Model
{
    use HasFactory;

    protected $fillable = ['nom_mutuel'];
    
    public function type()
    {
        return $this->belongsTo(TypeMutuel::class);
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }
}

