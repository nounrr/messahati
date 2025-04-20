<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CertificatMedicale;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Log;

class CertificatsMedicaleController extends Controller
{
    public function index()
    {
        $certificats = CertificatMedicale::all();
        return response()->json($certificats);
    }

    public function create()
    {
        return view('certificats.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'certificats_medicale.*.description' => 'required|string',
            'certificats_medicale.*.date_emission' => 'required|date',
            'certificats_medicale.*.typecertificat_id' => 'required|exists:typecertificats,id',
            'certificats_medicale.*.traitement_id' => 'required|exists:traitements,id'
        ]);

        $createdItems = [];

        foreach ($validated['certificats_medicale'] as $data) {
            $item = new CertificatMedicale();
            $item->description = $data['description'];
            $item->date_emission = $data['date_emission'];
            $item->typecertificat_id = $data['typecertificat_id'];
            $item->traitement_id = $data['traitement_id'];
            $item->save();

            $createdItems[] = $item;
        }

        return response()->json($createdItems, 201);
    }

    public function show($id)
    {
        $certificat = CertificatMedicale::findOrFail($id);
        return response()->json($certificat);
    }

    public function edit($id)
    {
        $certificat = CertificatMedicale::findOrFail($id);
        return view('certificats.edit', compact('certificat'));
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'updates' => 'required|array',
            'updates.*.id' => 'required|exists:certificats_medicale,id',
            'updates.*.description' => 'required|string',
            'updates.*.date_emission' => 'required|date',
            'updates.*.typecertificat_id' => 'required|exists:typecertificats,id',
            'updates.*.traitement_id' => 'required|exists:traitements,id'
        ]);

        $updatedItems = [];

        foreach ($validated['updates'] as $data) {
            $item = CertificatMedicale::findOrFail($data['id']);
            $item->description = $data['description'];
            $item->date_emission = $data['date_emission'];
            $item->typecertificat_id = $data['typecertificat_id'];
            $item->traitement_id = $data['traitement_id'];
            $item->save();

            $updatedItems[] = $item;
        }

        return response()->json($updatedItems, 200);
    }

    public function destroy($id)
    {
        $certificat = CertificatMedicale::findOrFail($id);
        $certificat->delete();

        return redirect()->route('certificats.index')->with('success', 'Certificat médical supprimé avec succès.');
    }
    public function generatePDF($id)
{
    try {
        Log::info('Tentative de génération du certificat médical ID: ' . $id);

        // Récupérer le certificat médical avec ses relations
        $certificat = CertificatMedicale::with([
            'traitement.rendezvous.patient',
            'traitement.rendezvous.docteur',
            'typeCertificat'
        ])->findOrFail($id);

        // Vérifiez si le type de certificat est manquant
        if (!$certificat->typeCertificat) {
            return response()->json([
                'error' => 'Le type de certificat est manquant.',
            ], 404);
        }

        // Préparer les données pour la vue
        $data = [
            'certificat' => $certificat,
            'rendezvous' => $certificat->traitement->rendezvous,
        ];

        // Charger la vue et générer le PDF
        $pdf = Pdf::loadView('CertificatMedicale', $data);

        Log::info('PDF généré avec succès');

        // Télécharger le fichier PDF
        return $pdf->download('certificat_medical.pdf');
    } catch (\Exception $e) {
        Log::error('Erreur lors de la génération du certificat médical:', [
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);

        return response()->json([
            'error' => 'Erreur lors de la génération du certificat médical',
            'message' => $e->getMessage()
        ], 500);
    }
}
// public function generatePatientReport($patientId)
// {
//     try {
//         Log::info('Tentative de génération du rapport médical pour le patient ID: ' . $patientId);

//         // Récupérer les informations du patient et ses rendez-vous
//         $patient = User::with([
//             'rendezvousAsPatient.traitement.certificatsMedicale.typeCertificat',
//             'rendezvousAsPatient.docteur'
//         ])->findOrFail($patientId);

//         // Vérifiez si le patient a des rendez-vous
//         if ($patient->rendezvousAsPatient->isEmpty()) {
//             return response()->json([
//                 'error' => 'Aucun rendez-vous trouvé pour ce patient.',
//             ], 404);
//         }

//         // Préparer les données pour la vue
//         $data = [
//             'patient' => $patient,
//         ];

//         // Charger la vue et générer le PDF
//         $pdf = Pdf::loadView('PatientReport', $data);

//         Log::info('Rapport médical généré avec succès');

//         // Télécharger le fichier PDF
//         return $pdf->download('rapport_medical_patient.pdf');
//     } catch (\Exception $e) {
//         Log::error('Erreur lors de la génération du rapport médical:', [
//             'error' => $e->getMessage(),
//             'trace' => $e->getTraceAsString()
//         ]);

//         return response()->json([
//             'error' => 'Erreur lors de la génération du rapport médical',
//             'message' => $e->getMessage()
//         ], 500);
//     }
// }
}
