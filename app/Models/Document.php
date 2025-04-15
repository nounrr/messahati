<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    use HasFactory;

    protected $fillable = ['type', 'traitement_id', 'file_path'];

    /**
     * Relation avec le modèle Traitement.
     */
    public function traitement()
    {
        return $this->belongsTo(Traitement::class);
    }
}
