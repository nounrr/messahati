<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Relations\Pivot;

class MutuelUser extends Pivot
{
    protected $table = 'mutuel_users'; 
    protected $fillable = ['user_id', 'mutuel_id', 'numero_police','numero_carte','lien_assure','date_validite','pourcentage_prise_en_charge'];
}
