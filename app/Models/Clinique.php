<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Clinique extends Model
{
    use HasFactory;
    protected $fillable=['nom','adresse','email','site_web','description','logo_path'];
   
}
