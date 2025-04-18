<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AuditLogClinique;

class AuditLogCliniqueSeeder extends Seeder
{
    public function run(): void
    {
        AuditLogClinique::insert([
            [
                'user_id' => 1, // Assuming User with ID 1 exists
                'action' => 'Created a new patient record',
                'date' => '2025-04-01',
            ],
            [
                'user_id' => 2, // Assuming User with ID 2 exists
                'action' => 'Updated patient information',
                'date' => '2025-04-02',
            ],
            [
                'user_id' => 3, // Assuming User with ID 3 exists
                'action' => 'Deleted a medical record',
                'date' => '2025-04-03',
            ],
        ]);
    }
}