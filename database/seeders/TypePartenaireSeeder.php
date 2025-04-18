<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\TypePartenaire;

class TypePartenaireSeeder extends Seeder
{
    public function run()
    {
        TypePartenaire::insert([
            ['nom' => 'Medical Supplies', 'description' => 'Suppliers of medical equipment'],
            ['nom' => 'Pharmaceuticals', 'description' => 'Suppliers of medicines'],
        ]);
    }
}