<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Ordonance;

class OrdonanceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Ordonance::insert([
            [
                'date_emission' => '2025-04-01',
                'description' => 'Prescription pour des antibiotiques.',
                'traitement_id' => 1, // Assuming Traitement with ID 1 exists
            ],
            [
                'date_emission' => '2025-04-05',
                'description' => 'Prescription pour des analgésiques.',
                'traitement_id' => 2, // Assuming Traitement with ID 2 exists
            ],
            [
                'date_emission' => '2025-04-10',
                'description' => 'Prescription pour des vitamines.',
                'traitement_id' => 3, // Assuming Traitement with ID 3 exists
            ],
        ]);
    }
}