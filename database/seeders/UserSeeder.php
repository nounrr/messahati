<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        DB::table('users')->insert([
            [
                'cin' => Str::random(10),
                'nom' => 'Doe',
                'prenom' => 'John',
                'email' => 'john.doe@example.com',
                'telephone' => '1234567890',
                'adresse' => '123 Main St',
                'date_inscription' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'cin' => Str::random(10),
                'nom' => 'Smith',
                'prenom' => 'Jane',
                'email' => 'jane.smith@example.com',
                'telephone' => '0987654321',
                'adresse' => '456 Elm St',
                'date_inscription' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Add more users as needed
        ]);
    }
}
