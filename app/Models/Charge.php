<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Charge extends Model
{
    use HasFactory;
    protected $fillable=['nom','prix_unitaire','quantite'];

    public function partenaire(){
        return $this->belongsTo(Partenaire::class);
    }
}
