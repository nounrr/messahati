<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\TypeCertificat;

class TypeCertificatSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        TypeCertificat::insert([
            ['type_certificat' => 'Medical Leave', 'description' => 'Certificate for medical leave'],
            ['type_certificat' => 'Fitness Certificate', 'description' => 'Certificate for physical fitness'],
            ['type_certificat' => 'Vaccination Certificate', 'description' => 'Certificate for vaccination'],
        ]);
    }
}