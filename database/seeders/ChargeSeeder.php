<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Charge;
use Carbon\Carbon;

class ChargeSeeder extends Seeder
{
    public function run()
    {
        // Get the last 7 days
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            
            // Create multiple charges for each day
        Charge::insert([
                [
                    'nom' => 'Surgical Equipment',
                    'prix_unitaire' => 500.00,
                    'quantite' => rand(1, 5),
                    'partenaire_id' => 1,
                    'created_at' => $date,
                    'updated_at' => $date
                ],
                [
                    'nom' => 'Antibiotics',
                    'prix_unitaire' => 20.00,
                    'quantite' => rand(10, 50),
                    'partenaire_id' => 2,
                    'created_at' => $date,
                    'updated_at' => $date
                ],
                [
                    'nom' => 'Medical Supplies',
                    'prix_unitaire' => 100.00,
                    'quantite' => rand(5, 15),
                    'partenaire_id' => 1,
                    'created_at' => $date,
                    'updated_at' => $date
                ],
                [
                    'nom' => 'Laboratory Equipment',
                    'prix_unitaire' => 1000.00,
                    'quantite' => rand(1, 3),
                    'partenaire_id' => 2,
                    'created_at' => $date,
                    'updated_at' => $date
                ]
            ]);
        }
    }
}