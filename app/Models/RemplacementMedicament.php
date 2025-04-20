<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RemplacementMedicament extends Model
{
    use HasFactory;

    protected $fillable = ['medicament_id', 'medicament_remplacement_id', 'raison'];

    /**
     * Relation avec le médicament d'origine.
     */
    public function medicament()
    {
        return $this->belongsTo(Medicament::class, 'medicament_id');
    }

    /**
     * Relation avec le médicament de remplacement.
     */
    public function medicamentRemplacement()
    {
        return $this->belongsTo(Medicament::class, 'medicament_remplacement_id');
    }
}
