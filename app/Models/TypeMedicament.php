<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TypeMedicament extends Model
{
    use HasFactory;
    protected $table = 'type_medicaments';

    public function medicaments(){
        return $this->hasMany(Medicament::class);
    }
}
