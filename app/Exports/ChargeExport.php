<?php

namespace App\Exports;

use App\Models\Charge;
use Maatwebsite\Excel\Concerns\FromCollection;

class ChargeExport implements FromCollection
{
    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return Charge::all();
    }
}
