<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Reclamation;
use Illuminate\Support\Facades\Auth;
use App\Events\ReclamationCreated;
use App\Events\ReclamationUpdated;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use App\Models\Notification;

class ReclamationController extends Controller
{
    // Liste des réclamations
    public function index()
    {
        $reclamations = Reclamation::with('user')->get();
        return response()->json($reclamations);
    }

    // Formulaire de création
    public function create()
    {
        return view('reclamation.create');
    }

    // Enregistrement d'une réclamation
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'titre' => 'required|string',
            'description' => 'required|string',
            'statut' => 'required|string|in:en_attente,traité,rejeté',
            'user_id' => 'required|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validated = $validator->validated();

        $reclamation = new Reclamation();
        $reclamation->titre = $validated['titre'];
        $reclamation->description = $validated['description'];
        $reclamation->statut = $validated['statut'];
        $reclamation->user_id = $validated['user_id'];
        $reclamation->save();

        // Récupération de l'utilisateur
        $user = User::find($validated['user_id']);

        // Création de la notification
        $notification = Notification::create([
            'date' => now()->toDateString(),
            'statut' => true
        ]);

        $notification->users()->attach($validated['user_id'], [
            'message' => "Une nouvelle réclamation a été créée : {$reclamation->titre}"
        ]);

        // Émettre l'événement de création
        event(new ReclamationCreated($reclamation));

        return response()->json($reclamation, 201);
    }

    // Affiche une réclamation
    public function show($id)
    {
        $reclamation = Reclamation::with('user')->findOrFail($id);
        return response()->json($reclamation);
    }

    // Formulaire d'édition
    public function edit($id)
    {
        $reclamation = Reclamation::findOrFail($id);
        return view('reclamation.edit', compact('reclamation'));
    }

    // Mise à jour d'une réclamation
    public function update(Request $request, $id)
    {
        $reclamation = Reclamation::findOrFail($id);

        $validated = $request->validate([
            'titre' => 'required|string',
            'description' => 'required|string',
            'statut' => 'required|string|in:en_attente,traité,rejeté',
            'user_id' => 'required|exists:users,id',
        ]);

        // Stocker les anciennes valeurs pour détecter les changements
        $oldValues = $reclamation->getAttributes();

        $reclamation->titre = $validated['titre'];
        $reclamation->description = $validated['description'];
        $reclamation->statut = $validated['statut'];
        $reclamation->user_id = $validated['user_id'];
        $reclamation->save();

        // Détecter les changements
        $changes = [];
        foreach ($validated as $key => $value) {
            if ($oldValues[$key] != $value) {
                $changes[$key] = [
                    'old' => $oldValues[$key],
                    'new' => $value
                ];
            }
        }

        // Récupération de l'utilisateur
        $user = User::find($validated['user_id']);

        // Création de la notification
        $notification = Notification::create([
            'date' => now()->toDateString(),
            'statut' => true
        ]);

        $notification->users()->attach($validated['user_id'], [
            'message' => "Votre réclamation a été mise à jour : {$reclamation->titre}"
        ]);

        // Émettre l'événement de mise à jour
        event(new ReclamationUpdated($reclamation));

        return response()->json($reclamation);
    }

    // Suppression d'une réclamation
    public function destroy($id)
    {
        $reclamation = Reclamation::findOrFail($id);
        
        // Récupération de l'utilisateur
        $user = User::find($reclamation->user_id);

        // Création de la notification
        $notification = Notification::create([
            'date' => now()->toDateString(),
            'statut' => true
        ]);

        $notification->users()->attach($reclamation->user_id, [
            'message' => "Votre réclamation a été supprimée : {$reclamation->titre}"
        ]);

        $reclamation->delete();
        return response()->json(null, 204);
    }
}
