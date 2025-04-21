<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\TypeTraitement;

class TypeTraitementSeeder extends Seeder
{
    public function run()
    {
        TypeTraitement::insert([
            ['nom' => 'Consultation', 'prix-default' => 50.00],
            ['nom' => 'Surgery', 'prix-default' => 500.00],
            ['nom' => 'Physical Therapy', 'prix-default' => 100.00], // Added third entry
        ]);
    }
}