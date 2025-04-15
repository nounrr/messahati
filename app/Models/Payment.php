<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = ['rendez_vous_id', 'montant', 'date', 'status'];

    public function rendezVous()
    {
        return $this->belongsTo(RendezVous::class, 'rendez_vous_id');
    }
}
