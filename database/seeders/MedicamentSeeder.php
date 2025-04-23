<?php

namespace Database\Seeders;

use App\Models\Medicament;
use App\Models\TypeMedicament;
use Illuminate\Database\Seeder;

class MedicamentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Exemple : type_medicament_id=1 pour Médicaments classiques — à adapter selon tes données réelles
        $typeMedicaments = TypeMedicament::pluck('id')->toArray();

        $medicaments = [
            [
                'nom_medicament' => 'Doliprane',
                'dosage' => '500mg',
                'forme' => 'Comprimé',
                'date_expiration' => '2026-12-31',
                'presentation' => 'Boîte de 16 comprimés',
                'substance_active' => 'Paracétamol',
                'classe_therapeutique' => 'Antalgique / Antipyrétique',
                'statut_commercialisation' => 'Commercialisé',
                'prix_ppv' => 20.50,
                'prix_ph' => 18.00,
                'prix_pfht' => 17.00,
                'typemedicaments_id' => $typeMedicaments[array_rand($typeMedicaments)],
                'img_path' => 'images/doliprane.png',
            ],
            [
                'nom_medicament' => 'Amoxicilline',
                'dosage' => '1g',
                'forme' => 'Comprimé',
                'date_expiration' => '2025-06-30',
                'presentation' => 'Boîte de 14 comprimés',
                'substance_active' => 'Amoxicilline',
                'classe_therapeutique' => 'Antibiotique',
                'statut_commercialisation' => 'Commercialisé',
                'prix_ppv' => 65.00,
                'prix_ph' => 55.00,
                'prix_pfht' => 50.00,
                'typemedicaments_id' => $typeMedicaments[array_rand($typeMedicaments)],
                'img_path' => 'images/amoxicilline.png',
            ],
            [
                'nom_medicament' => 'Efferalgan',
                'dosage' => '1g',
                'forme' => 'Comprimé effervescent',
                'date_expiration' => '2025-11-30',
                'presentation' => 'Tube de 8 comprimés',
                'substance_active' => 'Paracétamol',
                'classe_therapeutique' => 'Antalgique / Antipyrétique',
                'statut_commercialisation' => 'Commercialisé',
                'prix_ppv' => 30.00,
                'prix_ph' => 25.00,
                'prix_pfht' => 22.00,
                'typemedicaments_id' => $typeMedicaments[array_rand($typeMedicaments)],
                'img_path' => 'images/efferalgan.png',
            ],
            [
                'nom_medicament' => 'Spasfon',
                'dosage' => '80mg',
                'forme' => 'Comprimé',
                'date_expiration' => '2027-03-31',
                'presentation' => 'Boîte de 30 comprimés',
                'substance_active' => 'Phloroglucinol',
                'classe_therapeutique' => 'Antispasmodique',
                'statut_commercialisation' => 'Commercialisé',
                'prix_ppv' => 40.00,
                'prix_ph' => 35.00,
                'prix_pfht' => 32.00,
                'typemedicaments_id' => $typeMedicaments[array_rand($typeMedicaments)],
                'img_path' => 'images/spasfon.png',
            ],
            [
                'nom_medicament' => 'Augmentin',
                'dosage' => '500mg/62.5mg',
                'forme' => 'Comprimé',
                'date_expiration' => '2026-09-30',
                'presentation' => 'Boîte de 12 comprimés',
                'substance_active' => 'Amoxicilline + Acide clavulanique',
                'classe_therapeutique' => 'Antibiotique',
                'statut_commercialisation' => 'Commercialisé',
                'prix_ppv' => 85.00,
                'prix_ph' => 75.00,
                'prix_pfht' => 70.00,
                'typemedicaments_id' => $typeMedicaments[array_rand($typeMedicaments)],
                'img_path' => 'images/augmentin.png',
            ],
        ];

        foreach ($medicaments as $medicament) {
            Medicament::create($medicament);
        }
    }
}