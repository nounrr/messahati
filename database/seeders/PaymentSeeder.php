<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Payment;
use App\Models\RendezVous;
use Carbon\Carbon;

class PaymentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Vérifier si des rendez-vous existent
        if (RendezVous::count() === 0) {
            $this->command->info('Aucun rendez-vous trouvé. Veuillez exécuter RendezVousSeeder d\'abord.');
            return;
        }

        // Récupérer les rendez-vous
        $rendezVous = RendezVous::all();

        if ($rendezVous->isEmpty()) {
            $this->command->info('Données insuffisantes pour créer des paiements.');
            return;
        }

        // Méthodes de paiement disponibles
        $paymentMethods = ['espece', 'carte-bancaire', 'cheque'];

        // Créer des paiements pour 70% des rendez-vous
        $rendezVousCount = $rendezVous->count();
        $paymentsToCreate = (int)($rendezVousCount * 0.7);

        // Sélectionner aléatoirement 70% des rendez-vous
        $selectedRendezVous = $rendezVous->random($paymentsToCreate);

        foreach ($selectedRendezVous as $rendezVous) {
            // Générer un montant aléatoire entre 50 et 500
            $montant = rand(50, 500) + (rand(0, 99) / 100);

            // Générer une date aléatoire entre la date du rendez-vous et aujourd'hui
            $dateRendezVous = Carbon::parse($rendezVous->date_heure);
            $today = Carbon::today();
            
            // Si la date du rendez-vous est dans le futur, utiliser une date aléatoire entre aujourd'hui et la date du rendez-vous
            if ($dateRendezVous->isFuture()) {
                $date = Carbon::createFromTimestamp(rand($today->timestamp, $dateRendezVous->timestamp));
            } else {
                // Sinon, utiliser une date aléatoire entre la date du rendez-vous et aujourd'hui
                $date = Carbon::createFromTimestamp(rand($dateRendezVous->timestamp, $today->timestamp));
            }

            // 90% des paiements sont réussis (status = true), 10% sont en attente (status = false)
            $status = (rand(1, 100) <= 90);

            // Sélectionner une méthode de paiement aléatoire
            $paymentMethod = $paymentMethods[array_rand($paymentMethods)];

            // Créer le paiement
            Payment::create([
                'rendez_vous_id' => $rendezVous->id,
                'montant' => $montant,
                'date' => $date,
                'status' => $status,
                'payment_method' => $paymentMethod,
            ]);
        }

        // Créer quelques paiements supplémentaires pour les rendez-vous passés
        $pastRendezVous = RendezVous::where('date_heure', '<', Carbon::now())->get();
        
        if ($pastRendezVous->isNotEmpty()) {
            // Sélectionner 10 rendez-vous passés qui n'ont pas encore de paiement
            $pastRendezVousWithoutPayment = $pastRendezVous->whereNotIn('id', Payment::pluck('rendez_vous_id'))->take(10);
            
            foreach ($pastRendezVousWithoutPayment as $rendezVous) {
                $montant = rand(50, 500) + (rand(0, 99) / 100);
                $date = Carbon::createFromTimestamp(rand($rendezVous->date_heure->timestamp, Carbon::now()->timestamp));
                $status = (rand(1, 100) <= 90);
                $paymentMethod = $paymentMethods[array_rand($paymentMethods)];

                Payment::create([
                    'rendez_vous_id' => $rendezVous->id,
                    'montant' => $montant,
                    'date' => $date,
                    'status' => $status,
                    'payment_method' => $paymentMethod,
                ]);
            }
        }
    }
}