<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\RendezVous;
use App\Models\User;
use App\Models\Payment;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Str;

class RendezVousController extends Controller
{
    // Liste des rendez-vous
    public function index()
    {
        $rendezVous = RendezVous::with([
            'patient', 
            'docteur.departement',
            'departement', 
            'traitement.typetraitement',
            'payment'
        ])->get();
        return response()->json($rendezVous);
    }

    // Formulaire de création
    public function create()
    {
        return view('rendezvous.create');
    }

    // Enregistrement sans mass-assignement
    public function store(Request $request)
    {
        // Validation de base pour le format des données
        $request->validate([
            'rendez_vous' => 'required|array',
        ]);
        
        $createdItems = [];
        
        foreach ($request->rendez_vous as $rdvData) {
            // Gestion du patient (existant ou nouveau)
            if (!isset($rdvData['patient_id']) && isset($rdvData['newPatient'])) {
                // Créer un nouveau patient
                $patientData = $rdvData['newPatient'];
                $patientValidator = validator($patientData, [
                    'cin' => 'required|string|unique:users,cin',
                    'name' => 'required|string|max:255',
                    'prenom' => 'nullable|string|max:255',
                    'email' => 'nullable|string|email|max:255|unique:users,email',
                    'telephone' => 'nullable|string|max:20',
                    'adresse' => 'nullable|string|max:255',
                    'date_naissance' => 'required|date',
                    'departement_id' => 'required|exists:departements,id'
                ]);
                
                if ($patientValidator->fails()) {
                    return response()->json([
                        'message' => 'Erreur de validation pour le nouveau patient',
                        'errors' => $patientValidator->errors()
                    ], 422);
                }
                
                // Créer le patient
                $newPatient = new User();
                $newPatient->cin = $patientData['cin'];
                $newPatient->name = $patientData['name'];
                $newPatient->prenom = $patientData['prenom'] ?? null;
                $newPatient->email = $patientData['email'] ?? null;
                $newPatient->telephone = $patientData['telephone'] ?? null;
                $newPatient->adresse = $patientData['adresse'] ?? null;
                $newPatient->date_naissance = $patientData['date_naissance'];
                $newPatient->departement_id = $patientData['departement_id'];
                // Définir un statut par défaut pour les nouveaux patients
                $newPatient->status = true;
                // Générer un mot de passe aléatoire temporaire
                $newPatient->password = Hash::make(Str::random(10));
                $newPatient->save();
                
                // Assigner le rôle de patient
                $patientRole = Role::where('name', 'patient')->first();
                if ($patientRole) {
                    $newPatient->assignRole($patientRole);
                }
                
                // Utiliser l'ID du nouveau patient
                $rdvData['patient_id'] = $newPatient->id;
                
                // Retirer les données du nouveau patient pour éviter la confusion
                unset($rdvData['newPatient']);
            }
            
            // Validation des données du rendez-vous
            $rdvValidator = validator($rdvData, [
                'patient_id' => 'required|exists:users,id',
                'docteur_id' => 'required|exists:users,id',
                'departement_id' => 'required|exists:departements,id',
                'date_heure' => 'required',
                'traitement_id' => 'required|exists:traitements,id',
                'statut' => 'required',
                'montant' => 'nullable|numeric'
            ]);
            
            if ($rdvValidator->fails()) {
                return response()->json([
                    'message' => 'Erreur de validation pour le rendez-vous',
                    'errors' => $rdvValidator->errors()
                ], 422);
            }
            
            // Créer le rendez-vous
            $rendezVous = new RendezVous();
            $rendezVous->patient_id = $rdvData['patient_id'];
            $rendezVous->docteur_id = $rdvData['docteur_id'];
            $rendezVous->departement_id = $rdvData['departement_id'];
            $rendezVous->date_heure = $rdvData['date_heure'];
            $rendezVous->traitement_id = $rdvData['traitement_id'];
            $rendezVous->statut = $rdvData['statut'];
            
            if (isset($rdvData['remarques'])) {
                $rendezVous->remarques = $rdvData['remarques'];
            }
            
            $rendezVous->save();
            
            // Créer un paiement associé si les informations sont présentes
            if (isset($rdvData['statut_paiement'])) {
                $payment = new Payment();
                $payment->rendez_vous_id = $rendezVous->id;
                
                // Statut_paiement : 1 = Payé, 2 = En attente, 3 = Paiement à l'arrivée
                $statusMap = [
                    '1' => 1, // Payé
                    '2' => 0, // En attente
                    '3' => 0  // Paiement à l'arrivée
                ];
                
                $payment->status = $statusMap[$rdvData['statut_paiement']] ?? 0;
                
                // Si en attente (2), montant et date sont null
                if ($rdvData['statut_paiement'] === '2') {
                    $payment->montant = null;
                    $payment->date = null;
                } 
                // Si payé (1) ou paiement à l'arrivée (3) avec montant spécifié
                else if (isset($rdvData['montant']) && floatval($rdvData['montant']) > 0) {
                    $payment->montant = floatval($rdvData['montant']);
                    $payment->date = date('Y-m-d'); // Date du jour
                } 
                // Si aucun montant spécifié ou 0
                else {
                    $payment->montant = 0;
                    $payment->date = null;
                }
                
                $payment->save();
            }
            
            $createdItems[] = $rendezVous;
        }

        // Charger les relations pour les éléments créés
        $createdItemsWithRelations = RendezVous::with([
            'patient', 
            'docteur.departement', 
            'departement', 
            'traitement.typetraitement',
            'payment'
        ])
            ->whereIn('id', collect($createdItems)->pluck('id'))
            ->get();

        return response()->json($createdItemsWithRelations, 201);
    }

    // Affiche un rendez-vous spécifique
    public function show(string $id)
    {
        $rendezVous = RendezVous::with([
            'patient', 
            'docteur.departement',
            'departement', 
            'traitement.typetraitement',
            'payment'
        ])->findOrFail($id);
        return response()->json($rendezVous);
    }

    // Formulaire d'édition
    public function edit(string $id)
    {
        $rendezVous = RendezVous::findOrFail($id);
        return view('rendezvous.edit', compact('rendezVous'));
    }

    // Mise à jour sans mass-assignement
    public function update(Request $request)
    {
        $validated = $request->validate([
            'updates' => 'required|array',
            'updates.*.id' => 'required|exists:rendez_vous,id',
            'updates.*.patient_id' => 'required|exists:users,id',
            'updates.*.docteur_id' => 'required|exists:users,id',
            'updates.*.departement_id' => 'required|exists:departements,id',
            'updates.*.date_heure' => 'required',
            'updates.*.traitement_id' => 'required|exists:traitements,id',
            'updates.*.statut' => 'required'
        ]);

        $updatedIds = [];

        foreach ($validated['updates'] as $data) {
            $rendezVous = RendezVous::findOrFail($data['id']);
            $rendezVous->patient_id = $data['patient_id'];
            $rendezVous->docteur_id = $data['docteur_id'];
            $rendezVous->departement_id = $data['departement_id'];
            $rendezVous->date_heure = $data['date_heure'];
            $rendezVous->traitement_id = $data['traitement_id'];
            $rendezVous->statut = $data['statut'];
            
            if (isset($data['remarques'])) {
                $rendezVous->remarques = $data['remarques'];
            }
            
            $rendezVous->save();
            
            // Mettre à jour ou créer un paiement associé si nécessaire
            if (isset($data['statut_paiement'])) {
                $payment = Payment::firstOrNew(['rendez_vous_id' => $rendezVous->id]);
                
                $statusMap = [
                    '1' => 1, // Payé
                    '2' => 0, // En attente
                    '3' => 0  // Paiement à l'arrivée
                ];
                
                $payment->status = $statusMap[$data['statut_paiement']] ?? 0;
                
                // Si en attente (2), montant et date sont null
                if ($data['statut_paiement'] === '2') {
                    $payment->montant = null;
                    $payment->date = null;
                } 
                // Si payé (1) ou paiement à l'arrivée (3) avec montant spécifié
                else if (isset($data['montant']) && floatval($data['montant']) > 0) {
                    $payment->montant = floatval($data['montant']);
                    $payment->date = date('Y-m-d'); // Date du jour
                } 
                // Si aucun montant spécifié ou 0
                else {
                    $payment->montant = 0;
                    $payment->date = null;
                }
                
                $payment->save();
            }

            $updatedIds[] = $rendezVous->id;
        }

        // Charger les relations pour les éléments mis à jour
        $updatedItemsWithRelations = RendezVous::with([
            'patient', 
            'docteur.departement', 
            'departement', 
            'traitement.typetraitement',
            'payment'
        ])
            ->whereIn('id', $updatedIds)
            ->get();

        return response()->json($updatedItemsWithRelations, 200);
    }

    // Suppression d'un ou plusieurs rendez-vous
    public function destroy(Request $request, string $id = null)
    {
        if ($id) {
            $rendezVous = RendezVous::findOrFail($id);
            $rendezVous->delete();
        } else {
            $validatedData = $request->validate([
                'ids' => 'required|array',
                'ids.*' => 'required|exists:rendez_vous,id',
            ]);

            RendezVous::whereIn('id', $validatedData['ids'])->delete();
        }

        return response()->json(['message' => 'Rendez-vous supprimés avec succès.']);
    }
}
