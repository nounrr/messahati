<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Traitement extends Model
{
    use HasFactory;

    protected $fillable = ['description', 'date_debut', 'date_fin'];

    public function ordonnances()
    {
        return $this->belongsToMany(Ordonnance::class);
    }
}

