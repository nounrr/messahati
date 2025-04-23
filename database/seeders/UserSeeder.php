<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    private function generateBirthDate($minAge = 1, $maxAge = 80)
    {
        $now = now();
        $minDate = $now->copy()->subYears($maxAge);
        $maxDate = $now->copy()->subYears($minAge);
        
        return Carbon::createFromTimestamp(
            rand($minDate->timestamp, $maxDate->timestamp)
        )->format('Y-m-d');
    }

    public function run()
    {
        // Créer l'administrateur
        $date_naissance_admin = now()->subYears(30);
        $admin = User::create([
            'cin' => 'ADMIN123',
            'name' => 'Admin',
            'prenom' => 'System',
            'sexe' => 'homme',
            'Age' => Carbon::parse($date_naissance_admin)->age,
            'email' => 'admin@example.com',
            'telephone' => '0600000000',
            'adresse' => 'Adresse Admin',
            'date_naissance' => $date_naissance_admin,
            'departement_id' => 1,
            'password' => Hash::make('password'),
            'status' => true,
            'status_maladie' => false,
            'img_path' => 'default.png'
        ]);
        $admin->assignRole('secretary');

        // Créer des patients
        for ($i = 0; $i < 20; $i++) {
            $birthDate = $this->generateBirthDate(1, 80);
            
            $patient = User::create([
                'cin' => fake()->unique()->regexify('[A-Z]{2}[0-9]{6}'),
                'name' => fake()->lastName(),
                'prenom' => fake()->firstName(),
                'sexe' => fake()->randomElement(['homme', 'femme']),
                'Age' => Carbon::parse($birthDate)->age,
                'email' => fake()->unique()->safeEmail(),
                'telephone' => fake()->phoneNumber(),
                'adresse' => fake()->address(),
                'date_naissance' => $birthDate,
                'departement_id' => rand(1, 5),
                'password' => Hash::make('password'),
                'status' => true,
                'status_maladie' => fake()->boolean(),
                'img_path' => 'default.png'
            ]);
            $patient->assignRole('patient');
        }

        // Créer des médecins
        for ($i = 0; $i < 5; $i++) {
            $birthDate = $this->generateBirthDate(30, 65);
            
            $medecin = User::create([
                'cin' => fake()->unique()->regexify('[A-Z]{2}[0-9]{6}'),
                'name' => fake()->lastName(),
                'prenom' => fake()->firstName(),
                'sexe' => fake()->randomElement(['homme', 'femme']),
                'Age' => Carbon::parse($birthDate)->age,
                'email' => fake()->unique()->safeEmail(),
                'telephone' => fake()->phoneNumber(),
                'adresse' => fake()->address(),
                'date_naissance' => $birthDate,
                'departement_id' => rand(1, 5),
                'password' => Hash::make('password'),
                'status' => true,
                'status_maladie' => false,
                'img_path' => 'default.png'
            ]);
            $medecin->assignRole('doctor');
        }

        // Créer des infirmières
        for ($i = 0; $i < 3; $i++) {
            $birthDate = $this->generateBirthDate(25, 60);
            
            $infirmiere = User::create([
                'cin' => fake()->unique()->regexify('[A-Z]{2}[0-9]{6}'),
                'name' => fake()->lastName(),
                'prenom' => fake()->firstName(),
                'sexe' => fake()->randomElement(['homme', 'femme']),
                'Age' => Carbon::parse($birthDate)->age,
                'email' => fake()->unique()->safeEmail(),
                'telephone' => fake()->phoneNumber(),
                'adresse' => fake()->address(),
                'date_naissance' => $birthDate,
                'departement_id' => rand(1, 5),
                'password' => Hash::make('password'),
                'status' => true,
                'status_maladie' => false,
                'img_path' => 'default.png'
            ]);
            $infirmiere->assignRole('nurse');
        }
    }
}
