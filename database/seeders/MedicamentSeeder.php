<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Medicament;

class MedicamentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Medicament::insert([
            [
                'nom_medicament' => 'Paracetamol',
                'quantite' => 100,
                'date_expiration' => '2025-12-31',
                'typemedicaments_id' => 1, // Assuming TypeMedicament with ID 1 exists
                'prix_unitaire' => 5.50,
                'img_path' => null,
            ],
            [
                'nom_medicament' => 'Amoxicillin',
                'quantite' => 200,
                'date_expiration' => '2026-06-30',
                'typemedicaments_id' => 2, // Assuming TypeMedicament with ID 2 exists
                'prix_unitaire' => 10.00,
                'img_path' => null,
            ],
            [
                'nom_medicament' => 'Ibuprofen',
                'quantite' => 150,
                'date_expiration' => '2025-09-15',
                'typemedicaments_id' => 3, // Assuming TypeMedicament with ID 3 exists
                'prix_unitaire' => 8.75,
                'img_path' => null,
            ],
        ]);
    }
}