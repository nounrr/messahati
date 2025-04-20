<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Charge;

class ChargeSeeder extends Seeder
{
    public function run()
    {
        Charge::insert([
            ['nom' => 'Surgical Equipment', 'prix_unitaire' => 500.00, 'quantite' => 10, 'partenaire_id' => 1],
            ['nom' => 'Antibiotics', 'prix_unitaire' => 20.00, 'quantite' => 100, 'partenaire_id' => 2],
        ]);
    }
}