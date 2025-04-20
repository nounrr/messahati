<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Models\User;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        // Create 5 doctors
        $doctors = User::factory()->count(5)->create();
        $doctorRole = Role::where('name', 'doctor')->first();
        foreach ($doctors as $doctor) {
            $doctor->assignRole($doctorRole);
        }


        // Create 5 patients
        $patients = User::factory()->count(5)->create();
        $patientRole = Role::where('name', 'patient')->first();
        foreach ($patients as $patient) {
            $patient->assignRole($patientRole);
        }
    }
}
