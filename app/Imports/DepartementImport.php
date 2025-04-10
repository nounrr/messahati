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
     * @return \App\Models\Departement
     */
    public function model(array $row)
    {
        return new Departement([
            'nom' => $row['nom'],
            'description' => $row['description'],
        ]);
    }
}
