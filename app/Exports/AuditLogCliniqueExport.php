<?php

namespace App\Exports;

use App\Models\AuditLogClinique;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class AuditLogCliniqueExport implements FromCollection, WithHeadings
{
    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return AuditLogClinique::with('user')->get()->map(function ($log) {
            return [
                'ID' => $log->id,
                'User Name' => $log->user->name ?? 'N/A',
                'Action' => $log->action,
                'Date' => $log->date,
                'Created At' => $log->created_at,
                'Updated At' => $log->updated_at,
            ];
        });
    }

    /**
     * Define the headings for the Excel file.
     *
     * @return array
     */
    public function headings(): array
    {
        return [
            'ID',
            'User Name',
            'Action',
            'Date',
            'Created At',
            'Updated At',
        ];
    }
}