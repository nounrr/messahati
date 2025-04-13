<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Salaire extends Model
{
    protected $fillable=[
        'montant',
        'primes',
        'date'
    ];
    public function user(){
        return $this->belongsTo(User::class);
    }
}
