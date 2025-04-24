<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Materiel extends Model
{
    use HasFactory;

    protected $table = 'materiels';

    protected $fillable = [
        'clinique_id',
        'libelle',
        'quantite',
        'status',
    ];

    /**
     * Relationship with Clinique.
     */
    public function clinique()
    {
        return $this->belongsTo(Clinique::class);
    }
}
