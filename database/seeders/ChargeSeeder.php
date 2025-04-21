<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Charge;
use App\Models\Partenaire;

class ChargeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Assurons-nous qu'il existe des partenaires avant
        if (Partenaire::count() == 0) {
            Partenaire::factory()->count(5)->create();
        }

        $partenaires = Partenaire::all();

        $charges = [
            [
                'nom' => 'Fournitures de bureau',
                'prix_unitaire' => 150.00,
                'quantite' => 10,
                'status' => 'payée',
            ],
            [
                'nom' => 'Électricité',
                'prix_unitaire' => 1200.50,
                'quantite' => 1,
                'status' => 'en attente',
            ],
            [
                'nom' => 'Internet',
                'prix_unitaire' => 500.00,
                'quantite' => 1,
                'status' => 'payée',
            ],
            [
                'nom' => 'Entretien des locaux',
                'prix_unitaire' => 300.00,
                'quantite' => 2,
                'status' => 'payée',
            ],
            [
                'nom' => 'Assurance',
                'prix_unitaire' => 2000.00,
                'quantite' => 1,
                'status' => 'en attente',
            ],
        ];

        foreach ($charges as $charge) {
            Charge::create([
                'nom' => $charge['nom'],
                'prix_unitaire' => $charge['prix_unitaire'],
                'quantite' => $charge['quantite'],
                'status' => $charge['status'],
                'partenaire_id' => $partenaires->random()->id,
            ]);
        }
    }
}
