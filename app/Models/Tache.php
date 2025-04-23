<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Tache extends Model
{
    use HasFactory;


    protected $fillable = [
        'title',
        'description',
        'priority',
        'date_debut',
        'date_fin',
        'status',
    ];
    public function users(){
            return $this->belongsToMany(User::class)->using(UserTache::class)->withPivot('status');
    }
    public function attachements(){
        return $this->hasMany(Attachement::class);
    }
}
