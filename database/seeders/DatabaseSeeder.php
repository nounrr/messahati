<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Database\Seeders\UserSeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'prenom'=>'test',
        //     'date_inscription'=>'2025/2/6',
        //     'telephone'=>'',
        //     'departement_id'=>1,
        //     'img_path'=>'',
        //     'adresse'=>'',
        //     'status'=>false,
        //     'email' => 'test@example.com',
        // ]);
        $this->call(RolesAndPermissionsSeeder::class);
        $this->call([
            UserSeeder::class,
        ]);
    }
}
