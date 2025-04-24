<?php

namespace App\Exports;

use App\Models\TypeTraitement;
use Maatwebsite\Excel\Concerns\FromCollection;

class TypeTraitementExport implements FromCollection
{
    /**
     * Return the data to export.
     *
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return TypeTraitement::all();
    }
}