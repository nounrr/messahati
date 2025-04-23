<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Salaire;
use App\Models\User;
use Carbon\Carbon;

class SalaireSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all non-patient users
        $users = User::whereDoesntHave('roles', function ($query) {
            $query->where('name', 'patient');
        })->get();

        // Get the last 7 days
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            
            foreach ($users as $user) {
                Salaire::create([
                    'montant' => rand(3000, 8000),
                    'primes' => rand(500, 1500),
                    'date' => $date,
                    'user_id' => $user->id,
                    'created_at' => $date,
                    'updated_at' => $date
                ]);
            }
        }
    }
}