<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Ordonance extends Model
{
    use HasFactory;


    protected $fillable = ['date_emission','description','patient_id',
        'docteur_id'];
    
    public function traitement(){
        return $this->belongsTo(Traitement::class);
    }
    public function patient()
    {
        return $this->belongsTo(User::class, 'patient_id');
    }

    public function docteur()
    {
        return $this->belongsTo(User::class, 'docteur_id');
    }
    public function medicaments(){
        return $this->belongsToMany(Medicament::class,'ordonances_medicaments')->using(MedicamentOrdonance::class)->withPivot( 'dosage','frequence','duree');
    }
}
