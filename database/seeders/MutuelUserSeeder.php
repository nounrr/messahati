<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MutuelUser;

class MutuelUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        MutuelUser::insert([
            [
                'mutuel_id' => 1, // Assuming Mutuel with ID 1 exists
                'user_id' => 1, // Assuming User with ID 1 exists
                'numero_police' => 'POL123456',
                'numero_carte' => 'CARD123456',
                'lien_assure' => 'Self',
                'date_validite' => '2025-12-31',
                'pourcentage_prise_en_charge' => 80.00,
            ],
            [
                'mutuel_id' => 2, // Assuming Mutuel with ID 2 exists
                'user_id' => 2, // Assuming User with ID 2 exists
                'numero_police' => 'POL789012',
                'numero_carte' => 'CARD789012',
                'lien_assure' => 'Spouse',
                'date_validite' => '2026-06-30',
                'pourcentage_prise_en_charge' => 70.00,
            ],
            [
                'mutuel_id' => 3, // Assuming Mutuel with ID 3 exists
                'user_id' => 3, // Assuming User with ID 3 exists
                'numero_police' => 'POL345678',
                'numero_carte' => 'CARD345678',
                'lien_assure' => 'Child',
                'date_validite' => '2025-09-15',
                'pourcentage_prise_en_charge' => 90.00,
            ],
        ]);
    }
}