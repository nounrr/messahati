<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable=['montant','date','status'];

    public function rendezvous(){
        return $this->blongsTo(Rendezvous::class);
    }
}
