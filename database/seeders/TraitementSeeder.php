<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Traitement;

class TraitementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Traitement::insert([
            [
                'typetraitement_id' => 1, // Assuming TypeTraitement with ID 1 exists
                'description' => 'General consultation for health check-up.',
                'date_debut' => '2025-04-01',
                'date_fin' => null,
            ],
            [
                'typetraitement_id' => 2, // Assuming TypeTraitement with ID 2 exists
                'description' => 'Surgical procedure for knee replacement.',
                'date_debut' => '2025-03-15',
                'date_fin' => '2025-03-20',
            ],
            [
                'typetraitement_id' => 3, // Assuming TypeTraitement with ID 3 exists
                'description' => 'Physical therapy sessions for back pain.',
                'date_debut' => '2025-04-10',
                'date_fin' => '2025-04-30',
            ],
        ]);
    }
}