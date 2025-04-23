<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Materiel extends Model
{
    use HasFactory;
    protected $fillable = [
        'clinique_id',
        'libelle',
        'quantite',
        'status',
    ];

    /**
     * Relation avec la clinique
     */
    public function clinique()
    {
        return $this->belongsTo(Clinique::class);
    }
    
}
