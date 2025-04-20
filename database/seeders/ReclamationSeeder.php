<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Reclamation;

class ReclamationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Reclamation::insert([
            [
                'titre' => 'Problème de facturation',
                'description' => 'Erreur dans la facture du dernier rendez-vous.',
                'user_id' => 1, // Assuming User with ID 1 exists
                'statut' => 'en_attente',
            ],
            [
                'titre' => 'Retard dans le traitement',
                'description' => 'Le traitement prévu a été retardé sans explication.',
                'user_id' => 2, // Assuming User with ID 2 exists
                'statut' => 'en_attente',
            ],
            [
                'titre' => 'Problème de communication',
                'description' => 'Difficulté à joindre le service client.',
                'user_id' => 3, // Assuming User with ID 3 exists
                'statut' => 'résolu',
            ],
        ]);
    }
}