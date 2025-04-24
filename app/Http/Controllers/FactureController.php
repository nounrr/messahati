<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Payment;
use Barryvdh\DomPDF\Facade\PDF;
use Illuminate\Support\Facades\Log;

class FactureController extends Controller
{
    public function generatePDF($id)
    {
        try {
            Log::info('Tentative de génération de facture pour le paiement ID: ' . $id);
            
            $payment = Payment::with('rendezVous.patient')->findOrFail($id);
            
            Log::info('Paiement trouvé:', [
                'payment_id' => $payment->id,
                'rendez_vous_id' => $payment->rendez_vous_id,
                'montant' => $payment->montant
            ]);

            $data = [
                'numero_admission' => $payment->rendez_vous_id,
                'nom_patient' => $payment->rendezVous->patient->name,
                'date_encaissement' => $payment->date,
                'mode_paiement' => $payment->status,
                'reference_paiement' => $payment->id,
                'montant_paye' => $payment->montant,
            ];

            Log::info('Données de la facture:', $data);

            $pdf = PDF::loadView('factures.facture', $data);
            
            Log::info('PDF généré avec succès');
            
            return $pdf->download('facture.pdf');
        } catch (\Exception $e) {
            Log::error('Erreur lors de la génération de la facture:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'error' => 'Erreur lors de la génération de la facture',
                'message' => $e->getMessage()
            ], 500);
        }

    }   
    }