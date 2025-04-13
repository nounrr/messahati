<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attachement extends Model
{
    protected $fillable = [
        'filename'
    ];
    public function tache(){
        return $this->belongsTo(Tache::class);
    }
}
