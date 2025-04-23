<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Departement;
use Illuminate\Support\Facades\Hash;
use Faker\Factory as Faker;

class UserSeeder extends Seeder
{
    protected $faker;

    public function __construct()
    {
        $this->faker = Faker::create('fr_FR');
    }

    public function run(): void
    {
        // Créer un admin
        User::create([
            'cin' => 'ADMIN001',
            'name' => 'Admin',
            'prenom' => 'System',
            'sexe' => 'homme',
            'email' => 'admin@example.com',
            'telephone' => '0123456789',
            'adresse' => '123 Admin Street',
            'date_naissance' => '1990-01-01',
            'departement_id' => Departement::first()->id,
            'password' => Hash::make('password'),
            'img_path' => 'default.png',
            'status' => 'actif',
            'status_maladie' => false,
        ]);

        // Créer des docteurs
        for ($i = 1; $i <= 20; $i++) {
            User::create([
                'cin' => 'DOC' . str_pad($i, 3, '0', STR_PAD_LEFT),
                'name' => $this->faker->lastName,
                'prenom' => $this->faker->firstName,
                'sexe' => $this->faker->randomElement(['homme', 'femme']),
                'email' => 'docteur' . $i . '@example.com',
                'telephone' => $this->faker->phoneNumber,
                'adresse' => $this->faker->address,
                'date_naissance' => $this->faker->date('Y-m-d', '-30 years'),
                'departement_id' => Departement::inRandomOrder()->first()->id,
                'password' => Hash::make('password'),
                'img_path' => 'default.png',
                'status' => $this->faker->randomElement(['actif', 'congé', 'absent']),
                'status_maladie' => $this->faker->boolean(20),
            ]);
        }

        // Créer des patients
        for ($i = 1; $i <= 80; $i++) {
            User::create([
                'cin' => 'PAT' . str_pad($i, 3, '0', STR_PAD_LEFT),
                'name' => $this->faker->lastName,
                'prenom' => $this->faker->firstName,
                'sexe' => $this->faker->randomElement(['homme', 'femme']),
                'email' => 'patient' . $i . '@example.com',
                'telephone' => $this->faker->phoneNumber,
                'adresse' => $this->faker->address,
                'date_naissance' => $this->faker->date('Y-m-d', '-50 years'),
                'departement_id' => Departement::inRandomOrder()->first()->id,
                'password' => Hash::make('password'),
                'img_path' => 'default.png',
                'status' => $this->faker->randomElement(['actif', 'inactif']),
                'status_maladie' => $this->faker->boolean(30),
            ]);
        }
    }
}
