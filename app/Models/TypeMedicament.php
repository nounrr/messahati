<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TypeMedicament extends Model
{
    protected $table = 'type_medicaments';

    public function medicaments(){
        return $this->hasMany(Medicament::class);
    }
}
