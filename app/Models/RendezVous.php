<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RendezVous extends Model
{
    use HasFactory;

    protected $fillable = ['date_heure', 'statut', 'id_user'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

