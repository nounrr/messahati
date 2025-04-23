<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AuditLogClinique extends Model
{
    use HasFactory;

    protected $table = 'audit_log_clinique';

    protected $fillable = [
        'user_id',
        'action',
        'date',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
} 