<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Departement extends Model
{
    protected $fillable=['nom','description','img_path'];

    public function rendezvous(){
        return $this->hasMany(Rendezvous::class);
    }
    public function users(){
        return $this->hasMany(User::class);
    }
   

}
