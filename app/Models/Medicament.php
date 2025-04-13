<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Medicament extends Model
{
    protected $fillable = ['nom_medicament','quantite','date_expiration','prix_unitaire','img_path'];

    public function ordonances(){
        return $this->belongsToMany(Ordonance::class);
    }
    public function typemedicament(){
        return $this->belongsTo(TypeMedicament::class);
    }

}
