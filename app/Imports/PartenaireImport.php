<?php

namespace App\Imports;

use App\Models\Partenaire;
use App\Models\TypePartenaire;
use App\Models\Charge;
use Maatwebsite\Excel\Concerns\ToModel;

class PartenaireImport implements ToModel
{
    /**
     * Convert each row of the Excel file into a model.
     *
     * @param  array  $row
     * @return void
     */
    public function model(array $row)
    {
        // Skip rows with missing required data
        if (!isset($row[0]) || !isset($row[1]) || !isset($row[4])) {
            return null;
        }

        // Normalize the Type Partenaire name (trim spaces)
        $typePartenaireName = trim($row[1]);

        // Create or find the TypePartenaire
        $typePartenaire = TypePartenaire::firstOrCreate(
            ['nom' => $typePartenaireName],
            ['description' => 'Imported from CSV'] // Optional description
        );

        // Create or find the Partenaire
        $partenaire = Partenaire::firstOrCreate(
            ['nom' => $row[0]], // First column: Partenaire name
            [
                'typepartenaires_id' => $typePartenaire->id,
                'adress' => $row[2] ?? null, // Third column: Address (optional)
                'telephone' => $row[3] ?? null, // Fourth column: Telephone (optional)
            ]
        );

        // Ensure numeric values for prix_unitaire and quantite
        $prixUnitaire = is_numeric($row[5]) ? (float) $row[5] : 0;
        $quantite = is_numeric($row[6]) ? (int) $row[6] : 0;

        // Create the Charge associated with the Partenaire
        Charge::create([
            'nom' => $row[4], // Fifth column: Charge name
            'prix_unitaire' => $prixUnitaire, // Sixth column: Unit price
            'quantite' => $quantite, // Seventh column: Quantity
            'partenaire_id' => $partenaire->id, // Foreign key
        ]);
    }
}
