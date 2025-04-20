<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\TypeMedicament;

class TypeMedicamentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        TypeMedicament::insert([
            ['nom' => 'Antibiotics'],
            ['nom' => 'Painkillers'],
            ['nom' => 'Vitamins'],
            ['nom' => 'Antidepressants'],
            ['nom' => 'Antihistamines'],
        ]);
    }
}