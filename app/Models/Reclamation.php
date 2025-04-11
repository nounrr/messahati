<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reclamation extends Model
{
    protected $fillable = [
        'contenu',
        'date',
        'status',
    ];
    public function user(){
        return $this->belongsTo(User::class);
    }
}
