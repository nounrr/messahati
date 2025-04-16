<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Payment extends Model
{
    use HasFactory;
    protected $fillable=['montant','date','status'];

    public function rendezvous(){
        return $this->belongsTo(Rendezvous::class);
    }
}
