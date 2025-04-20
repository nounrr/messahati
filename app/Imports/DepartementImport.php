<?php

namespace App\Imports;

use App\Models\Departement;
use Maatwebsite\Excel\Concerns\ToModel;

class DepartementImport implements ToModel
{
    /**
     * Convert each row of the Excel file into a model.
     *
     * @param  array  $row
     * @return \App\Models\Departement|null
     */
    public function model(array $row)
    {
        // Skip rows with missing required data
        if (!isset($row[0]) || !isset($row[1])) {
            return null;
        }

        return new Departement([
            'nom' => $row[0], // First column: Department name
            'description' => $row[1], // Second column: Department description
        ]);
    }
}
