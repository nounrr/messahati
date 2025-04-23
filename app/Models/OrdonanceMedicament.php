<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class OrdonanceMedicament extends Model
{
    use HasFactory;

    protected $table = 'ordonances_medicaments';

    protected $fillable = [
        'ordonance_id',
        'medicament_id',
    ];

    public function ordonance()
    {
        return $this->belongsTo(Ordonance::class);
    }

    public function medicament()
    {
        return $this->belongsTo(Medicament::class);
    }
} 