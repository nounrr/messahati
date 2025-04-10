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
        
        if (!isset($row[1]) || !isset($row[2])) {
            return null;
        }

        return new Departement([
            'nom' => $row[1], 
            'description' => $row[2], 
        ]);
    }
}
