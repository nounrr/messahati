<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;

class UserTache extends Pivot
{
    protected $table = 'user_taches'; 
    protected $fillable = ['user_id', 'tache_id', 'status'];
}