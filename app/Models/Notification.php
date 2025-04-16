<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Notification extends Model
{
    use HasFactory;
    protected $fillable = ['date','statut'];

    public function users(){
        return $this->belongsToMany(User::class)->using(NotificationUser::class)->withPivot('message');
    }
}
