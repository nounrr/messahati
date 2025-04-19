<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Mutuel;

class MutuelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Mutuel::insert([
            ['nom_mutuel' => 'Mutuel Santé Plus'],
            ['nom_mutuel' => 'Mutuel Bien-Être'],
            ['nom_mutuel' => 'Mutuel Famille'],
            ['nom_mutuel' => 'Mutuel Premium'],
            ['nom_mutuel' => 'Mutuel Sécurité'],
        ]);
    }
}