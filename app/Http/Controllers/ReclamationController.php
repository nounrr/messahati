<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Reclamation;
use Illuminate\Support\Facades\Auth;

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
        // Récupérer l'ID de l'utilisateur connecté
        $userId = Auth::id();
        
        if (!$userId) {
            return response()->json([
                'message' => 'Utilisateur non authentifié'
            ], 401);
        }

        // Vérifier si la requête contient un tableau de réclamations
        if (is_array($request->all())) {
            $reclamations = $request->all();
            $created = [];
            
            foreach ($reclamations as $data) {
                $validated = validator($data, [
                    'titre' => 'required|string',
                    'description' => 'required|string',
                ])->validate();
                
                $reclamation = new Reclamation();
                $reclamation->titre = $validated['titre'];
                $reclamation->description = $validated['description'];
                $reclamation->statut = 'en_attente';
                $reclamation->user_id = $userId;
                $reclamation->save();
                
                $reclamation->load('user');
                $created[] = $reclamation;
            }
            
            return response()->json($created, 201);
        } else {
            // Traitement d'une seule réclamation
            $validated = $request->validate([
                'titre' => 'required|string',
                'description' => 'required|string',
            ]);

            $reclamation = new Reclamation();
            $reclamation->titre = $validated['titre'];
            $reclamation->description = $validated['description'];
            $reclamation->statut = 'en_attente';
            $reclamation->user_id = $userId;
            $reclamation->save();

            $reclamation->load('user');
            return response()->json($reclamation, 201);
        }
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
        ]);

        $reclamation->titre = $validated['titre'];
        $reclamation->description = $validated['description'];
        // Le statut et user_id ne sont pas modifiables
        $reclamation->save();

        $reclamation->load('user');
        return response()->json($reclamation);
    }

    // Suppression d'une réclamation
    public function destroy($id)
    {
        $reclamation = Reclamation::findOrFail($id);
        $reclamation->delete();
        return response()->json(null, 204);
    }
}
