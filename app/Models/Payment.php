<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    public function rendezvous(){
        return $this->belongsTo(Rendezvous::class,'rendez_vous_id');

}
