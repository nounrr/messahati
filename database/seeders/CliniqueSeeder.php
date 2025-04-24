<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CliniqueSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('cliniques')->insert([
            [
                'nom' => 'Clinique Principale',
                'adresse' => '123 Rue Principale',
                'email' => 'contact@clinique-principale.com',
                'site_web' => 'https://clinique-principale.com',
                'description' => 'Une clinique moderne offrant des services de santé de qualité',
                'logo_path' => 'default.png',
                'created_at' => now(),
                'updated_at' => now()
            ]
        ]);
    }
}
