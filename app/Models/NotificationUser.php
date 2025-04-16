<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class NotificationUser extends Pivot

{
    use HasFactory;
    protected $table = 'notification_users'; 
    protected $fillable = ['user_id', 'notification_id', 'message'];
}