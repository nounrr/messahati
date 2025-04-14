<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MutuelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $mutuels = [
            ['nom_mutuel' => 'CNOPS'], // Caisse Nationale des Organismes de Prévoyance Sociale
            ['nom_mutuel' => 'CNSS'],  // Caisse Nationale de Sécurité Sociale
            ['nom_mutuel' => 'RAMED'], // Régime d’Assistance Médicale
            ['nom_mutuel' => 'MUTUELLE POLICE'],
            ['nom_mutuel' => 'MUTUELLE ARMÉE'],
            ['nom_mutuel' => 'MUTUELLE ENSEIGNANTS'],
            ['nom_mutuel' => 'ATLANTA SANAD'],
            ['nom_mutuel' => 'RMA WATANYA'],
            ['nom_mutuel' => 'ZURICH ASSURANCE MAROC'],
            ['nom_mutuel' => 'AXA ASSURANCES MAROC'],
            ['nom_mutuel' => 'WAFA ASSURANCE'],
        ];

        DB::table('mutuels')->insert($mutuels);
    }
}
