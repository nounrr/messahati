<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FeedbackSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('feedbacks')->insert([
            [
                'contenu' => 'Excellent service and friendly staff.',
                'date' => '2025-04-01',
                'rating' => 4.5,
                'status' => true, // Assuming true means active
                'user_id' => 1, // Ensure User with ID 1 exists
            ],
            [
                'contenu' => 'The waiting time was too long.',
                'date' => '2025-04-02',
                'rating' => 3.0,
                'status' => true,
                'user_id' => 2, // Ensure User with ID 2 exists
            ],
            [
                'contenu' => 'The doctor was very professional and helpful.',
                'date' => '2025-04-03',
                'rating' => 5.0,
                'status' => true,
                'user_id' => 3, // Ensure User with ID 3 exists
            ],
        ]);
    }
}