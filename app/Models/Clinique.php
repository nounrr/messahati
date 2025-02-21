<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Clinique extends Model
{
    use HasFactory;

    protected $fillable = ['nom', 'adresse', 'email', 'site_web', 'description'];

  
}
