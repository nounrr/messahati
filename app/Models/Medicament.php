<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Medicament extends Model
{
    use HasFactory;
    protected $fillable = ['nom_medicament','quantite','date_expiration','prix_unitaire','img_path'];

    public function ordonances(){
        return $this->belongsToMany(Ordonance::class);
    }
    public function typemedicament(){
        return $this->belongsTo(TypeMedicament::class);
    }
    public function ventes()
    {
        return $this->hasMany(Vente::class);
    }

}
