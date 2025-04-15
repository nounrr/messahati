<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TypePartenaire extends Model
{
    use HasFactory;

    protected $fillable = ['nom', 'description'];

    public function partenaires()
    {
        return $this->hasMany(Partenaire::class);
    }
}
