<?php

namespace App\Exports;

use App\Models\User;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class UserExport implements FromCollection, WithHeadings
{
    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return User::with('roles', 'departement')->get()->map(function ($user) {
            return [
                'CIN' => $user->cin,
                'Name' => $user->name,
                'Prenom' => $user->prenom,
                'Email' => $user->email,
                'Telephone' => $user->telephone,
                'Adresse' => $user->adresse,
                'Date Inscription' => $user->date_inscription,
                'Departement' => $user->departement->nom ?? 'N/A',
                'Roles' => $user->roles->pluck('name')->join(', '), // Join role names as a string
                'Status' => $user->status ? 'Active' : 'Inactive',
                'Updated At' => $user->updated_at,
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
            'CIN',
            'Name',
            'Prenom',
            'Email',
            'Telephone',
            'Adresse',
            'Date Inscription',
            'Departement',
            'Roles',
            'Status',
            'Updated At',
        ];
    }
}
