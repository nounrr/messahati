<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\RendezVous;
use Carbon\Carbon;

class RendezVousSeeder extends Seeder
{
    public function run()
    {
        // Récupérer les IDs des médecins et patients
        $medecins = User::role('doctor')->pluck('id')->toArray();
        $patients = User::role('patient')->pluck('id')->toArray();

        if (empty($medecins) || empty($patients)) {
            throw new \Exception('No doctors or patients found. Please run UserSeeder first.');
        }

        // Créer des rendez-vous pour les 7 prochains jours
        for ($i = 0; $i < 7; $i++) {
            $date = Carbon::today()->addDays($i);
            
            // 5 rendez-vous par jour
            for ($j = 0; $j < 5; $j++) {
                RendezVous::create([
                    'date_heure' => $date->copy()->addHours(8 + $j * 2), // Rendez-vous entre 8h et 18h
                    'statut' => fake()->boolean(),
                    'patient_id' => fake()->randomElement($patients),
                    'docteur_id' => fake()->randomElement($medecins),
                    'departement_id' => rand(1, 5),
                    'traitement_id' => rand(1, 3)
                ]);
            }
        }
    }
}