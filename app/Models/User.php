<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;
    use HasRoles;

    public function hasRole($role)
    {
        return $this->roles->contains('name', $role);
    }
    public function hasPermissionTo($permission)
    {
        return $this->permissions->contains('name', $permission);
    }
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'prenom',
        'cin',
        'email',
        'telephone',
        'adresse',
        'date_naissance',
        'img_path',
        'status',
        'password',
        'Age',
        'sexe',
        'status_maladie',
        'departement_id'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'date_naissance' => 'date',
        'Age' => 'float'
    ];
    public function taches(){
            return $this->belongsToMany(Tache::class)->using(UserTache::class)->withPivot( 'status');
     }
     public function reclamations(){
        return $this->hasMany(Reclamation::class);
     }
    public function messages(){
        return $this->hasMany(Message::class);
    }
    public function salaire(){
        return $this->hasOne(Salaire::class);
    }
    public function mutuels(){
        return $this->belongsToMany(Mutuel::class)->using(MutuelUser::class)->withPivot( 'numero_police','numero_carte','lien_assure','date_validite','pourcentage_prise_en_charge');
    }
    public function feedbacks(){
        return $this->hasMany(Feedback::class);
    }
    public function notifications(){
        return $this->belongsToMany(Notification::class)->using(NotificationUser::class)->withPivot( 'message');
    }

    public function rendezvous(){
        return $this->hasMany(Rendezvous::class);
    }
    public function departement(){
        return $this->belongsTo(Departement::class);
    }
}
