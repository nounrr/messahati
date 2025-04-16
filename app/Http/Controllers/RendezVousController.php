<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Rendezvous;
use App\Models\Notification;
use App\Events\RendezVousCreated;
use App\Events\RendezVousUpdated;
use App\Events\RendezVousCancelled;
use App\Models\User;

class RendezVousController extends Controller
{
    // Liste des rendez-vous
    public function index()
    {
        $rendezVous = Rendezvous::all();
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
        $validated = $request->validate([
            'rendez_vous' => 'required|array',
            'rendez_vous.*.patient_id' => 'required|exists:users,id',
            'rendez_vous.*.docteur_id' => 'required|exists:users,id',
            'rendez_vous.*.departement_id' => 'required|exists:departements,id',
            'rendez_vous.*.date_heure' => 'required',
            'rendez_vous.*.traitement_id' => 'required|exists:traitements,id',
            'rendez_vous.*.statut' => 'required'
        ]);

        $createdItems = [];

        foreach ($validated['rendez_vous'] as $data) {
            $rendezVous = new Rendezvous();
            $rendezVous->patient_id = $data['patient_id'];
            $rendezVous->docteur_id = $data['docteur_id'];
            $rendezVous->departement_id = $data['departement_id'];
            $rendezVous->date_heure = $data['date_heure'];
            $rendezVous->traitement_id = $data['traitement_id'];
            $rendezVous->statut = $data['statut'];
            $rendezVous->save();

            // Récupération des utilisateurs
            $doctor = User::find($data['docteur_id']);
            $patient = User::find($data['patient_id']);

            // Création de la notification pour le docteur
            $doctorNotification = Notification::create([
                'date' => now()->toDateString(),
                'statut' => true
            ]);

            $doctorNotification->users()->attach($data['docteur_id'], [
                'message' => "Nouveau rendez-vous avec {$patient->name} le {$data['date_heure']}"
            ]);

            // Création de la notification pour le patient
            $patientNotification = Notification::create([
                'date' => now()->toDateString(),
                'statut' => true
            ]);

            $patientNotification->users()->attach($data['patient_id'], [
                'message' => "Rendez-vous confirmé avec Dr. {$doctor->name} le {$data['date_heure']}"
            ]);

            // Diffusion de l'événement
            broadcast(new RendezVousCreated($rendezVous, $doctor, $patient))->toOthers();

            $createdItems[] = $rendezVous;
        }

        return response()->json($createdItems, 201);
    }

    // Affiche un rendez-vous spécifique
    public function show(string $id)
    {
        $rendezVous = Rendezvous::findOrFail($id);
        return response()->json($rendezVous);
    }

    // Formulaire d'édition
    public function edit(string $id)
    {
        $rendezVous = Rendezvous::findOrFail($id);
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

        $updatedItems = [];

        foreach ($validated['updates'] as $data) {
            $rendezVous = Rendezvous::findOrFail($data['id']);
            
            // Stocker les anciennes valeurs pour détecter les changements
            $oldValues = $rendezVous->getAttributes();
            
            $rendezVous->patient_id = $data['patient_id'];
            $rendezVous->docteur_id = $data['docteur_id'];
            $rendezVous->departement_id = $data['departement_id'];
            $rendezVous->date_heure = $data['date_heure'];
            $rendezVous->traitement_id = $data['traitement_id'];
            $rendezVous->statut = $data['statut'];
            $rendezVous->save();

            // Détecter les changements
            $changes = [];
            foreach ($data as $key => $value) {
                if ($oldValues[$key] != $value) {
                    $changes[$key] = [
                        'old' => $oldValues[$key],
                        'new' => $value
                    ];
                }
            }

            // Récupération des utilisateurs
            $doctor = User::find($data['docteur_id']);
            $patient = User::find($data['patient_id']);

            // Création de la notification pour le docteur
            $doctorNotification = Notification::create([
                'date' => now()->toDateString(),
                'statut' => true
            ]);

            $doctorNotification->users()->attach($data['docteur_id'], [
                'message' => "Modification du rendez-vous avec {$patient->name} le {$data['date_heure']}"
            ]);

            // Création de la notification pour le patient
            $patientNotification = Notification::create([
                'date' => now()->toDateString(),
                'statut' => true
            ]);

            $patientNotification->users()->attach($data['patient_id'], [
                'message' => "Modification du rendez-vous avec Dr. {$doctor->name} le {$data['date_heure']}"
            ]);

            // Diffusion de l'événement
            broadcast(new RendezVousUpdated($rendezVous, $doctor, $patient, $changes))->toOthers();

            $updatedItems[] = $rendezVous;
        }

        return response()->json($updatedItems, 200);
    }

    // Suppression d'un ou plusieurs rendez-vous
    public function destroy(Request $request, string $id = null)
    {
        if ($id) {
            $rendezVous = Rendezvous::findOrFail($id);
            $doctor = User::find($rendezVous->docteur_id);
            $patient = User::find($rendezVous->patient_id);

            // Création de la notification pour le docteur
            $doctorNotification = Notification::create([
                'date' => now()->toDateString(),
                'statut' => true
            ]);

            $doctorNotification->users()->attach($rendezVous->docteur_id, [
                'message' => "Annulation du rendez-vous avec {$patient->name} le {$rendezVous->date_heure}"
            ]);

            // Création de la notification pour le patient
            $patientNotification = Notification::create([
                'date' => now()->toDateString(),
                'statut' => true
            ]);

            $patientNotification->users()->attach($rendezVous->patient_id, [
                'message' => "Annulation du rendez-vous avec Dr. {$doctor->name} le {$rendezVous->date_heure}"
            ]);

            // Diffusion de l'événement
            broadcast(new RendezVousCancelled($rendezVous, $doctor, $patient))->toOthers();

            $rendezVous->delete();
        } else {
            $validatedData = $request->validate([
                'ids' => 'required|array',
                'ids.*' => 'required|exists:rendez_vous,id',
            ]);

            foreach ($validatedData['ids'] as $id) {
                $rendezVous = Rendezvous::findOrFail($id);
                $doctor = User::find($rendezVous->docteur_id);
                $patient = User::find($rendezVous->patient_id);

                // Création de la notification pour le docteur
                $doctorNotification = Notification::create([
                    'date' => now()->toDateString(),
                    'statut' => true
                ]);

                $doctorNotification->users()->attach($rendezVous->docteur_id, [
                    'message' => "Annulation du rendez-vous avec {$patient->name} le {$rendezVous->date_heure}"
                ]);

                // Création de la notification pour le patient
                $patientNotification = Notification::create([
                    'date' => now()->toDateString(),
                    'statut' => true
                ]);

                $patientNotification->users()->attach($rendezVous->patient_id, [
                    'message' => "Annulation du rendez-vous avec Dr. {$doctor->name} le {$rendezVous->date_heure}"
                ]);

                // Diffusion de l'événement
                broadcast(new RendezVousCancelled($rendezVous, $doctor, $patient))->toOthers();
            }

            Rendezvous::whereIn('id', $validatedData['ids'])->delete();
        }

        return response()->json(['message' => 'Rendez-vous supprimés avec succès.']);
    }

    public function getNotifications($userId)
    {
        $notifications = Notification::whereHas('users', function($query) use ($userId) {
            $query->where('users.id', $userId);
        })
        ->with(['users' => function($query) use ($userId) {
            $query->where('users.id', $userId)
                  ->select('users.id', 'notification_users.message', 'notification_users.created_at');
        }])
        ->orderBy('created_at', 'desc')
        ->get();

        return response()->json([
            'status' => 'success',
            'notifications' => $notifications->map(function($notification) {
                return [
                    'id' => $notification->id,
                    'message' => $notification->users->first()->pivot->message,
                    'date' => $notification->date,
                    'created_at' => $notification->users->first()->pivot->created_at,
                    'statut' => $notification->statut
                ];
            })
        ]);
    }
}
