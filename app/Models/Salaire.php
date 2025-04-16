<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Salaire extends Model
{
    use HasFactory;
    protected $fillable=[
        'montant',
        'primes',
        'date'
    ];
    public function user(){
        return $this->belongsTo(User::class);
    }
}
