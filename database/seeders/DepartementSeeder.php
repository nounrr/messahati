<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DepartementSeeder extends Seeder
{
    public function run()
    {
        $cliniqueId = DB::table('cliniques')->first()->id;

        DB::table('departements')->insert([
            [
                'nom' => 'Médecine Générale',
                'description' => 'Service de médecine générale',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nom' => 'Cardiologie',
                'description' => 'Service de cardiologie',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nom' => 'Pédiatrie',
                'description' => 'Service de pédiatrie',
                'created_at' => now(),
                'updated_at' => now()
            ]
        ]);
    }
}