<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Payment;
use Barryvdh\DomPDF\Facade\PDF;

class FactureController extends Controller
{
    public function generatePDF($id)
    {
        $payment = Payment::findOrFail($id);

        $data = [
            'numero_admission' => $payment->rendez_vous_id,
            'nom_patient' => $payment->rendezVous->patient->nom,
            'date_encaissement' => $payment->date,
            'mode_paiement' => $payment->status,
            'reference_paiement' => $payment->id,
            'montant_paye' => $payment->montant,
        ];

        $pdf = PDF::loadView('factures.facture', $data);

        return $pdf->download('facture.pdf');
    }
}
