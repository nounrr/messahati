<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Ordonance extends Model
{
    use HasFactory;
    protected $fillable = ['date_emission','description'];
    
    public function traitement(){
        return $this->belongsTo(Traitement::class);
    }
    public function medicaments(){
        return $this->belongsToMany(Medicament::class);
    }
}
