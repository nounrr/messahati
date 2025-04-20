<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Partenaire;

class PartenaireSeeder extends Seeder
{
    public function run()
    {
        Partenaire::insert([
            ['nom' => 'MediSupply Co.', 'adress' => '123 Health St', 'typepartenaires_id' => 1, 'telephone' => '123456789'],
            ['nom' => 'PharmaCorp', 'adress' => '456 Medicine Rd', 'typepartenaires_id' => 2, 'telephone' => '987654321'],
        ]);
    }
}