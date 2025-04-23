<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Vente;
use App\Models\Medicament;
use Carbon\Carbon;

class VenteSeeder extends Seeder
{
    public function run(): void
    {
        // On prend tous les médicaments existants
        $medicaments = Medicament::all();

        foreach ($medicaments as $medicament) {
            // Créons une vente pour aujourd'hui
            Vente::create([
                'medicament_id' => $medicament->id,
                'quantite' => rand(1, 5),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);
        }
    }
}
