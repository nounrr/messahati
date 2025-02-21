<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ordonnance extends Model
{
    use HasFactory;

    protected $fillable = ['date_emission', 'description'];

    public function medicaments()
    {
        return $this->belongsToMany(Medicament::class, 'ordonnances_medicaments');
    }
}

