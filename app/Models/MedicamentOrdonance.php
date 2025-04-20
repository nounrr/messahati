<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;

class MedicamentOrdonance extends Pivot
{
    protected $table = 'ordonances_medicaments'; 
    protected $fillable = ['ordonance_id', 'medicament_id', 'dosage','frequence','duree'];

}
