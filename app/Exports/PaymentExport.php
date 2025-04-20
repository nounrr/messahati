<?php

namespace App\Exports;

use App\Models\Payment;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class PaymentExport implements FromCollection, WithHeadings
{
    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return Payment::with([
            'rendezvous',
            'rendezvous.traitement',
            'rendezvous.docteur',
            'rendezvous.patient'
        ])->get()->map(function ($payment) {
            return [
                'Nom Traitement' => $payment->rendezvous->traitement->description ?? 'N/A',
                'Date Rendezvous' => $payment->rendezvous->date_heure ?? 'N/A',
                'Nom Docteur' => $payment->rendezvous->docteur->name ?? 'N/A',
                'Nom Patient' => $payment->rendezvous->patient->name ?? 'N/A',
                'Prix' => $payment->montant,
                'Methode Payment' => $payment->payment_method ?? 'N/A',
                'Date Payment' => $payment->date,
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
            'Nom Traitement',
            'Date Rendezvous',
            'Nom Docteur',
            'Nom Patient',
            'Prix',
            'Methode Payment',
            'Date Payment',
        ];
    }
}
