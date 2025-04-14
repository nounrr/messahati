<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;

class NotificationUser extends Pivot
{
    protected $table = 'notification_users'; 
    protected $fillable = ['user_id', 'notification_id', 'message'];
}