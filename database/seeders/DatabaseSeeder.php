<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            // CliniqueSeeder::class,
            // DepartementSeeder::class,
            // RolesAndPermissionsSeeder::class,
            UserSeeder::class,
        ]);
    }
}
