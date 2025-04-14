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
     * @return \App\Models\TypeTraitement
     */
    public function model(array $row)
    {
        return new TypeTraitement([
            'nom' => $row['nom'],
            'description' => $row['description'],
        ]);
    }
}
