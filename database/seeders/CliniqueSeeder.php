<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

use Illuminate\Support\Facades\DB;

class CliniqueSeeder extends Seeder
{
    public function run()
    {
        DB::table('cliniques')->insert([
            [
                'nom' => 'Clinique Principale',
                'adresse' => '123 Rue Principale',
                'email' => 'contact@clinique.com',
                'description' => 'Clinique principale du système',
                'site_web' => 'www.clinique.com',
                'created_at' => now(),
                'updated_at' => now()
            ]
        ]);
    }
} 
