<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Salaire;

class SalaireSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Salaire::insert([
            [
                'montant' => 3000.00,
                'primes' => 500.00,
                'date' => '2025-04-01',
                'user_id' => 1, // Assuming User with ID 1 exists
            ],
            [
                'montant' => 4500.00,
                'primes' => 750.00,
                'date' => '2025-04-01',
                'user_id' => 2, // Assuming User with ID 2 exists
            ],
            [
                'montant' => 2500.00,
                'primes' => 300.00,
                'date' => '2025-04-01',
                'user_id' => 3, // Assuming User with ID 3 exists
            ],
        ]);
    }
}