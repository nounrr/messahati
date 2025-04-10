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
    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function departement()
    {
        return $this->belongsTo(Departement::class);
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    public function feedbacks()
    {
        return $this->hasMany(Feedback::class);
    }

    public function mutuel()
    {
        return $this->belongsTo(Mutuel::class);
    }

    public function taches()
    {
        return $this->hasMany(Tache::class);
    }

    public function messages()
    {
        return $this->hasMany(Message::class);
    }

    public function paiements()
    {
        return $this->hasMany(Paiement::class);
    }

    public function ordonnances()
    {
        return $this->hasMany(Ordonnance::class);
    }

    public function reclamations()
    {
        return $this->hasMany(Reclamation::class);
    }

    public function rendezVous()
    {
        return $this->hasMany(RendezVous::class);
    }


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
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
