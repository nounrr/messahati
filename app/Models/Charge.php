<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Charge extends Model
{

    protected $fillable = ['nom', 'prix_unitaire', 'quantite', 'partenaire_id'];


    public function partenaire()
    {
        return $this->belongsTo(Partenaire::class);
    }
}
