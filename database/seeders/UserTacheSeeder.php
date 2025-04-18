<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\UserTache;

class UserTacheSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        UserTache::insert([
            [
                'taches_id' => 1, // Assuming Tache with ID 1 exists
                'user_id' => 1,   // Assuming User with ID 1 exists
            ],
            [
                'taches_id' => 2, // Assuming Tache with ID 2 exists
                'user_id' => 2,   // Assuming User with ID 2 exists
            ],
            [
                'taches_id' => 3, // Assuming Tache with ID 3 exists
                'user_id' => 3,   // Assuming User with ID 3 exists
            ],
        ]);
    }
}