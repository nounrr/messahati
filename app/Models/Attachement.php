<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Attachement extends Model
{
    use HasFactory;
    protected $fillable = [
        'filename'
    ];
    public function tache(){
        return $this->belongsTo(Tache::class);
    }
}
