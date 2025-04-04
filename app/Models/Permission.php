<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Permission extends Model
{
    use HasFactory;

    protected $fillable = ['nom_permission', 'description'];

    public function users()
    {
        return $this->hasMany(User::class);
    }
    public function roles()
    {
        return $this->belongsToMany(Role::class);
    } 
}
