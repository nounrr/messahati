<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Reclamation extends Model
{
    use HasFatory;
    protected $fillable = [
        'titre',
        'description',
        'statut',
        'user_id',
    ];
    
    protected $casts = [
        'statut' => 'string',
    ];
    
    public function user(){
        return $this->belongsTo(User::class);
    }
}
