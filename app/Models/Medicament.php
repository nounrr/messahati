<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Medicament extends Model
{
    protected $fillable = [
        'nom_medicament',
        'dosage',
        'forme',
        'substance_active',
        'classe_therapeutique',
        'conditionnement',
        'code_cip',
        'laboratoire',
        'indications',
        'contre_indications',
        'effets_indesirables',
        'interactions',
        'precautions',
        'posologie',
        'mode_administration',
        'surdosage',
        'conservation',
        'prix',
        'quantite',
        'date_expiration',
        'typemedicaments_id',
        'img_path',
    ];

    public function ordonances()
    {
        return $this->belongsToMany(Ordonance::class);
    }

    public function typemedicament()
    {
        return $this->belongsTo(TypeMedicament::class);
    }
}

