<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Departement extends Model
{
    use HasFactory;


    protected $fillable=['nom','description','img_path'];

    public function rendezvous(){
        return $this->hasMany(Rendezvous::class);
    }
    public function users(){
        return $this->hasMany(User::class);
    }
   


}
