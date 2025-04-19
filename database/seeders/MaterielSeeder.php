<?php

namespace Database\Seeders;

use App\Models\Materiel;
use App\Models\Clinique;
use Illuminate\Database\Seeder;

class MaterielSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Vérifie qu’il existe au moins une clinique
        $clinique = Clinique::first();

        if (!$clinique) {
            $this->command->warn("Aucune clinique trouvée. Veuillez d'abord insérer des cliniques.");
            return;
        }

        // Exemple de seed
        Materiel::create([
            'clinique_id' => $clinique->id,
            'libelle' => 'lits',
            'quantite' => 10,
            'status' => true, // utilisé
        ]);

        Materiel::create([
            'clinique_id' => $clinique->id,
            'libelle' => 'Lit médicalisé',
            'quantite' => 4,
            'status' => false, // en stock
        ]);

        Materiel::create([
            'clinique_id' => $clinique->id,
            'libelle' => 'Moniteur de signes vitaux',
            'quantite' => 2,
            'status' => true,
        ]);
    }
}
