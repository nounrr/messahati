<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TacheSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('taches')->insert([
            [
                'title' => 'Prepare monthly report',
                'user_id' => 1, // Ensure User with ID 1 exists
                'description' => 'Compile and prepare the monthly financial report.',
                'status' => true, // Assuming true means completed
                'priority' => 'High',
                'date_debut' => '2025-04-01',
                'date_fin' => '2025-04-05',
            ],
            [
                'title' => 'Team meeting preparation',
                'user_id' => 2, // Ensure User with ID 2 exists
                'description' => 'Prepare agenda and materials for the team meeting.',
                'status' => false, // Assuming false means not completed
                'priority' => 'Medium',
                'date_debut' => '2025-04-06',
                'date_fin' => '2025-04-07',
            ],
            [
                'title' => 'Client follow-up',
                'user_id' => 3, // Ensure User with ID 3 exists
                'description' => 'Follow up with clients regarding project updates.',
                'status' => false,
                'priority' => 'Low',
                'date_debut' => '2025-04-08',
                'date_fin' => null, // No end date specified
            ],
        ]);
    }
}