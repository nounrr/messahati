<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrdonanceMedicament extends Model
{
    use HasFactory;

    protected $table = 'ordonances_medicaments'; // Specify the table name

    protected $fillable = [
        'ordonance_id',
        'medicament_id',
    ];
}
