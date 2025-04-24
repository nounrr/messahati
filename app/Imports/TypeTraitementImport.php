<?php

namespace App\Imports;

use App\Models\TypeTraitement;
use Maatwebsite\Excel\Concerns\ToModel;

class TypeTraitementImport implements ToModel
{
    /**
     * Convert each row of the Excel file into a model.
     *
     * @param  array  $row
     * @return \App\Models\TypeTraitement|null
     */
    public function model(array $row)
    {
        // Ensure the row has the required data
        if (!isset($row[0])) {
            return null;
        }

        return new TypeTraitement([
            'nom' => $row[0], // First column: TypeTraitement name
            'prix-default' => isset($row[1]) && is_numeric($row[1]) ? (float) $row[1] : null, // Second column: Default price (optional)
        ]);
    }
}