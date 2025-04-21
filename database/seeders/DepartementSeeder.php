<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

use App\Models\Departement;

use Illuminate\Support\Facades\DB;


class DepartementSeeder extends Seeder
{
    public function run()
    {

        Departement::insert([
            ['nom' => 'Cardiology', 'description' => 'Heart-related treatments', 'img_path' => null],
            ['nom' => 'Neurology', 'description' => 'Brain and nervous system treatments', 'img_path' => null],
            ['nom' => 'Orthopedics', 'description' => 'Bone and joint treatments', 'img_path' => null],
            ['nom' => 'Pediatrics', 'description' => 'Child healthcare', 'img_path' => null],
            ['nom' => 'Dermatology', 'description' => 'Skin-related treatments', 'img_path' => null],
            ['nom' => 'Radiology', 'description' => 'Imaging and diagnostics', 'img_path' => null],
            ['nom' => 'Oncology', 'description' => 'Cancer treatments', 'img_path' => null],
            ['nom' => 'Psychiatry', 'description' => 'Mental health treatments', 'img_path' => null],
            ['nom' => 'Gastroenterology', 'description' => 'Digestive system treatments', 'img_path' => null],
            ['nom' => 'Urology', 'description' => 'Urinary tract treatments', 'img_path' => null],

        ]);
    }
}