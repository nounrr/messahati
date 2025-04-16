<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Database\Seeders\UserSeeder;
use Database\Seeders\RolesAndPermissionsSeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run()
    {
        /*$this->call(RolesAndPermissionsSeeder::class);*/

        // Créer d'abord les départements
        \App\Models\Departement::factory(5)->create();
    
        // Ensuite les users qui dépendent des départements
        \App\Models\User::factory(10)->create();
    
        \App\Models\Rendezvous::factory(20)->create();
        \App\Models\Partenaire::factory(5)->create();
    
        \App\Models\Salaire::factory(50)->create();
        \App\Models\Payment::factory(50)->create();
        \App\Models\Charge::factory(30)->create();
        \App\Models\Traitement::factory(10)->create();
        \App\Models\TypeTraitement::factory(10)->create();
        \App\Models\Partenaire::factory()->count(10)->create(); 
        \App\Models\TypePartenaire::factory()->count(5)->create(); // Crée 5 types de partenaires



        
    }
    
}    