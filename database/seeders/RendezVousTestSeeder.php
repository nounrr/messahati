<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\RendezVous;
use App\Models\User;
use Spatie\Permission\Models\Role;

class RendezVousTestSeeder extends Seeder
{
    public function run()
    {
        // Get valid doctor and patient IDs
        $doctors = User::role('doctor')->pluck('id')->toArray(); // Fetch IDs of users with the "doctor" role
        $patients = User::role('patient')->pluck('id')->toArray(); // Fetch IDs of users with the "patient" role

        if (empty($doctors) || empty($patients)) {
            throw new \Exception('No doctors or patients found. Please seed the users table first.');
        }

        // Insert rendezvous records
        RendezVous::insert([
            [
                'date_heure' => '2025-04-20 10:00:00',
                'departement_id' => 1,
                'docteur_id' => $doctors[array_rand($doctors)],
                'patient_id' => $patients[array_rand($patients)],
                'statut' => 1,
                'traitement_id' => 1,
            ],
            [
                'date_heure' => '2025-04-21 14:30:00',
                'departement_id' => 2,
                'docteur_id' => $doctors[array_rand($doctors)],
                'patient_id' => $patients[array_rand($patients)],
                'statut' => 0,
                'traitement_id' => 2,
            ],
            [
                'date_heure' => '2025-04-22 09:00:00',
                'departement_id' => 3,
                'docteur_id' => $doctors[array_rand($doctors)],
                'patient_id' => $patients[array_rand($patients)],
                'statut' => 1,
                'traitement_id' => 3,
            ],
        ]);
    }
}