<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Mutuel extends Model
{
    protected $fillable = ['nom_mutuel'];
    public function users(){
        return $this->belongsToMany(User::class)->using(MutuelUser::class)->withPivot( 'numero_police','numero_carte','lien_assure','date_validite','pourcentage_prise_en_charge');
    }
}
