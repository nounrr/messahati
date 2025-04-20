<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Log;

class RapportController extends Controller
{
    public function generatePatientReport($patientId)
    {
        try {
            Log::info('Tentative de génération du rapport médical pour le patient ID: ' . $patientId);

            // Récupérer les informations du patient et ses rendez-vous
            $patient = User::with([
                'rendezvousAsPatient.traitement.certificatMedicales.typeCertificat',
                'rendezvousAsPatient.docteur'
            ])->findOrFail($patientId);

            // Vérifiez si le patient a des rendez-vous
            if ($patient->rendezvousAsPatient->isEmpty()) {
                return response()->json([
                    'error' => 'Aucun rendez-vous trouvé pour ce patient.',
                ], 404);
            }

            // Préparer les données pour la vue
            $data = [
                'patient' => $patient,
            ];

            // Charger la vue et générer le PDF
            $pdf = Pdf::loadView('PatientReport', $data);

            Log::info('Rapport médical généré avec succès');

            // Télécharger le fichier PDF
            return $pdf->download('rapport_medical_patient.pdf');
        } catch (\Exception $e) {
            Log::error('Erreur lors de la génération du rapport médical:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'Erreur lors de la génération du rapport médical',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
