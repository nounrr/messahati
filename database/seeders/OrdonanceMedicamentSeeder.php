<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\OrdonanceMedicament;

class OrdonanceMedicamentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        OrdonanceMedicament::insert([
            [
                'ordonance_id' => 1, // Assuming Ordonance with ID 1 exists
                'medicament_id' => 1, // Assuming Medicament with ID 1 exists
            ],
            [
                'ordonance_id' => 1,
                'medicament_id' => 2,
            ],
            [
                'ordonance_id' => 2, // Assuming Ordonance with ID 2 exists
                'medicament_id' => 3, // Assuming Medicament with ID 3 exists
            ],
        ]);
    }
}