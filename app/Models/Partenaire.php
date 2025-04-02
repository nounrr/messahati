<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Partenaire extends Model
{
    use HasFactory;

    protected $fillable = ['adresse', 'telephone'];
    public function type()
    {
        return $this->belongsTo(TypePartenaire::class);
    }
    public function clinique()
    {
        return $this->belongsTo(Clinique::class);
    }
}
