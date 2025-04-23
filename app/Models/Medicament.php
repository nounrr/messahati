<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Medicament extends Model
{
    use HasFactory;


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
        'remplacement', // Nouveau champ ajouté
    ];

    public function ordonances(){
        return $this->belongsToMany(Ordonance::class,'ordonances_medicaments')->using(MedicamentOrdonance::class)->withPivot( 'dosage','frequence','duree');

    }

    public function typemedicament()
    {
        return $this->belongsTo(TypeMedicament::class);
    }

    /**
     * Relation avec les médicaments de remplacement.
     */
    public function remplacements()
    {
        return $this->hasMany(RemplacementMedicament::class, 'medicament_id');
    }

    /**
     * Relation avec les médicaments qui remplacent celui-ci.
     */
    public function remplacePar()
    {
        return $this->hasMany(RemplacementMedicament::class, 'medicament_remplacement_id');
    }

    /**
     * Relation avec les utilisateurs via la table pharmacie_user.
     */
    public function users()
    {
        return $this->belongsToMany(User::class, 'pharmacie_user')
                    ->withPivot('payment', 'statut', 'quantite')
                    ->withTimestamps();
    }
}

