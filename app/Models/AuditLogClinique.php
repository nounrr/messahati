<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AuditLogClinique extends Model
{

    protected $table = 'audit_log_clinique';
    // Allow mass assignment for these fields
    protected $fillable = ['user_id', 'action', 'date'];

    /**
     * Define the relationship with the User model.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}