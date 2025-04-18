<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Attachement;

class AttachementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Attachement::insert([
            [
                'filename' => 'report_2025_04_01.pdf',
                'taches_id' => 1, // Assuming Tache with ID 1 exists
            ],
            [
                'filename' => 'presentation_2025_04_02.pptx',
                'taches_id' => 2, // Assuming Tache with ID 2 exists
            ],
            [
                'filename' => 'budget_2025_04_03.xlsx',
                'taches_id' => 3, // Assuming Tache with ID 3 exists
            ],
        ]);
    }
}