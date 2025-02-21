<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Medicament extends Model
{
    use HasFactory;

    protected $fillable = ['nom_medicament', 'quantite', 'date_expiration', 'prix_unitaire'];

    public function ordonnances()
    {
        return $this->belongsToMany(Ordonnance::class, 'ordonnances_medicaments');
    }
}
