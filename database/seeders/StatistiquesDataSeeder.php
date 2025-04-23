<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\TypeTraitement;
use App\Models\Traitement;
use App\Models\RendezVous;
use App\Models\Payment;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class StatistiquesDataSeeder extends Seeder
{
    public function run(): void
    {
        // Créer des types de traitements
        $typesTraitements = [
            ['nom' => 'Consultation générale', 'prix-default' => 100.00],
            ['nom' => 'Consultation spécialisée', 'prix-default' => 150.00],
            ['nom' => 'Consultation d\'urgence', 'prix-default' => 200.00],
            ['nom' => 'Soin infirmier', 'prix-default' => 50.00],
            ['nom' => 'Radiologie', 'prix-default' => 300.00],
        ];

        foreach ($typesTraitements as $type) {
            TypeTraitement::create($type);
        }

        // Créer des médecins
        $medecins = [];
        for ($i = 0; $i < 5; $i++) {
            $medecins[] = User::create([
                'cin' => 'M' . str_pad(rand(1000, 9999), 5, '0', STR_PAD_LEFT),
                'name' => fake()->lastName(),
                'prenom' => fake()->firstName(),
                'sexe' => fake()->randomElement(['homme', 'femme']),
                'Age' => rand(30, 60),
                'email' => fake()->unique()->safeEmail(),
                'telephone' => fake()->phoneNumber(),
                'adresse' => fake()->address(),
                'date_naissance' => fake()->date(),
                'departement_id' => 1,
                'password' => bcrypt('password'),
                'status' => true,
                'status_maladie' => false,
            ]);
        }

        // Créer des patients
        $patients = [];
        for ($i = 0; $i < 20; $i++) {
            $patients[] = User::create([
                'cin' => 'P' . str_pad(rand(1000, 9999), 5, '0', STR_PAD_LEFT),
                'name' => fake()->lastName(),
                'prenom' => fake()->firstName(),
                'sexe' => fake()->randomElement(['homme', 'femme']),
                'Age' => rand(18, 80),
                'email' => fake()->unique()->safeEmail(),
                'telephone' => fake()->phoneNumber(),
                'adresse' => fake()->address(),
                'date_naissance' =>fake()->date(),
                'departement_id' => 1,
                'password' => bcrypt('password'),
                'status' => true,
                'status_maladie' => fake()->boolean(20), // 20% de chance d'être malade
            ]);
        }

        // Générer des traitements et rendez-vous pour les 30 derniers jours
        $startDate = Carbon::now()->subDays(30);
        $endDate = Carbon::now();

        for ($date = $startDate; $date <= $endDate; $date->addDay()) {
            // Générer entre 5 et 15 consultations par jour
            $nbConsultations = rand(5, 15);
            
            for ($i = 0; $i < $nbConsultations; $i++) {
                // Créer un traitement
                $typeTraitement = TypeTraitement::where('nom', 'like', '%consultation%')
                    ->inRandomOrder()
                    ->first();

                $traitement = Traitement::create([
                    'typetraitement_id' => $typeTraitement->id,
                    'description' => 'Consultation du ' . $date->format('d/m/Y'),
                    'date_debut' => $date,
                    'date_fin' => $date,
                ]);

                // Créer un rendez-vous
                $heure = str_pad(rand(8, 17), 2, '0', STR_PAD_LEFT) . ':' . str_pad(rand(0, 3) * 15, 2, '0', STR_PAD_LEFT);
                $dateHeure = $date->copy()->setTimeFromTimeString($heure);

                $rendezVous = RendezVous::create([
                    'date_heure' => $dateHeure,
                    'statut' => true,
                    'patient_id' => $patients[array_rand($patients)]->id,
                    'docteur_id' => $medecins[array_rand($medecins)]->id,
                    'departement_id' => 1,
                    'traitement_id' => $traitement->id,
                ]);

                // Créer un paiement
                Payment::create([
                    'rendez_vous_id' => $rendezVous->id,
                    'montant' => $typeTraitement->{'prix-default'},
                    'date' => $date,
                    'payment_method' => fake()->randomElement(['espece', 'carte-bancaire']),
                    'status' => fake()->randomElement(['avance', 'payé']),
                ]);
            }
        }
    }
} 