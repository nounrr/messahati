<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Clinique extends Model
{
    protected $fillable=['nom','adresse','email','site_web','description','logo_path'];
   
}
