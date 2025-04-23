<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\RendezVous;
use App\Models\Notification;
use App\Models\NotificationUser;
use App\Services\NotificationService;
use App\Events\RendezVousCreated;

class RendezVousController extends Controller
{
    // Liste des rendez-vous
    public function index()
    {
        $rendezVous = RendezVous::with([
            'patient', 
            'docteur', 
            'departement', 
            'traitement.typetraitement'
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
        $request->validate([
            'rendez_vous' => 'required|array',
            'rendez_vous.*.patient_id' => 'required|exists:users,id',
            'rendez_vous.*.docteur_id' => 'required|exists:users,id',
            'rendez_vous.*.departement_id' => 'required|exists:departements,id',
            'rendez_vous.*.date_heure' => 'required|date',
            'rendez_vous.*.traitement_id' => 'required|exists:traitements,id',
            'rendez_vous.*.statut' => 'required|boolean'
        ]);

        $createdItems = [];

        foreach ($request->rendez_vous as $data) {
            $rendezVous = new RendezVous();
            $rendezVous->patient_id = $data['patient_id'];
            $rendezVous->docteur_id = $data['docteur_id'];
            $rendezVous->departement_id = $data['departement_id'];
            $rendezVous->date_heure = $data['date_heure'];
            $rendezVous->traitement_id = $data['traitement_id'];
            $rendezVous->statut = $data['statut'];
            $rendezVous->save();

            // Envoyer les notifications
            NotificationService::envoyerNotifications(
                $data['patient_id'],
                $data['docteur_id'],
                'rendez-vous',
                ['date_heure' => date('d/m/Y H:i', strtotime($data['date_heure']))]
            );
            event(new RendezVousCreated($rendezVous, $rendezVous->docteur_id, $rendezVous->patient_id ));


            $createdItems[] = $rendezVous;
        }

        // Charger les relations pour les éléments créés
        $createdItemsWithRelations = RendezVous::with([
            'patient', 
            'docteur', 
            'departement', 
            'traitement.typetraitement'
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
            'docteur', 
            'departement', 
            'traitement.typetraitement'
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
        $request->validate([
            'updates' => 'required|array',
            'updates.*.id' => 'required|exists:rendez_vous,id',
            'updates.*.patient_id' => 'required|exists:users,id',
            'updates.*.docteur_id' => 'required|exists:users,id',
            'updates.*.departement_id' => 'required|exists:departements,id',
            'updates.*.date_heure' => 'required|date',
            'updates.*.traitement_id' => 'required|exists:traitements,id',
            'updates.*.statut' => 'required|boolean'
        ]);

        $updatedIds = [];

        foreach ($request->updates as $data) {
            $rendezVous = RendezVous::findOrFail($data['id']);
            $rendezVous->patient_id = $data['patient_id'];
            $rendezVous->docteur_id = $data['docteur_id'];
            $rendezVous->departement_id = $data['departement_id'];
            $rendezVous->date_heure = $data['date_heure'];
            $rendezVous->traitement_id = $data['traitement_id'];
            $rendezVous->statut = $data['statut'];
            $rendezVous->save();

            // Envoyer les notifications de mise à jour
            NotificationService::envoyerNotifications(
                $data['patient_id'],
                $data['docteur_id'],
                'rendez-vous',
                ['date_heure' => date('d/m/Y H:i', strtotime($data['date_heure']))]
            );

            $updatedItems[] = $rendezVous;
        }

        // Charger les relations pour les éléments mis à jour
        $updatedItemsWithRelations = RendezVous::with([
            'patient', 
            'docteur', 
            'departement', 
            'traitement.typetraitement'
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
            
            // Envoyer les notifications de suppression
            NotificationService::envoyerNotifications(
                $rendezVous->patient_id,
                $rendezVous->docteur_id,
                'rendez-vous',
                ['date_heure' => date('d/m/Y H:i', strtotime($rendezVous->date_heure))]
            );

            $rendezVous->delete();
        } else {
            $validatedData = $request->validate([
                'ids' => 'required|array',
                'ids.*' => 'required|exists:rendez_vous,id',
            ]);

            $rendezVous = RendezVous::whereIn('id', $validatedData['ids'])->get();
            
            foreach ($rendezVous as $rv) {
                // Envoyer les notifications de suppression pour chaque rendez-vous
                NotificationService::envoyerNotifications(
                    $rv->patient_id,
                    $rv->docteur_id,
                    'rendez-vous',
                    ['date_heure' => date('d/m/Y H:i', strtotime($rv->date_heure))]
                );
            }

            RendezVous::whereIn('id', $validatedData['ids'])->delete();
        }

        return response()->json(['message' => 'Rendez-vous supprimés avec succès.']);
    }
}
