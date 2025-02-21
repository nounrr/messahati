<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tache extends Model
{
    use HasFactory;

    protected $fillable = ['description', 'date', 'id_user'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

