<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class PharmacieUser extends Pivot
{
    protected $table = 'pharmacie_user';

    protected $fillable = [
        'medicament_id',
        'user_id',
        'payment',
        'statut',
        'quantite',
    ];

    /**
     * Relation avec le modèle Medicament.
     */
    public function medicament()
    {
        return $this->belongsTo(Medicament::class);
    }

    /**
     * Relation avec le modèle User.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
