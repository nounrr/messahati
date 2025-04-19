<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CertificatMedicaleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('certificats_medicale')->insert([
            [
                'description' => 'Medical leave for flu recovery',
                'date_emission' => '2025-04-01',
                'typecertificat_id' => 1, // Assuming TypeCertificat with ID 1 exists
                'traitement_id' => 1, // Assuming Traitement with ID 1 exists
            ],
            [
                'description' => 'Fitness certificate for gym membership',
                'date_emission' => '2025-04-10',
                'typecertificat_id' => 2, // Assuming TypeCertificat with ID 2 exists
                'traitement_id' => 2, // Assuming Traitement with ID 2 exists
            ],
            [
                'description' => 'Vaccination certificate for travel',
                'date_emission' => '2025-04-15',
                'typecertificat_id' => 3, // Assuming TypeCertificat with ID 3 exists
                'traitement_id' => 3, // Assuming Traitement with ID 3 exists
            ],
        ]);
    }
}