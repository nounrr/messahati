<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Vente extends Model
{
    use HasFactory;

    protected $table = 'vendus';  // Specify the correct table name

    protected $fillable = [
        'medicament_id',
        'quantite',
    ];

    public function medicament()
    {
        return $this->belongsTo(Medicament::class);
    }
}
