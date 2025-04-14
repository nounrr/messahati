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
        // Vérifier si la requête contient un tableau de réclamations
        if ($request->isJson() && is_array($request->json()->all())) {
            $reclamations = $request->json()->all();
            $created = [];
            
            foreach ($reclamations as $data) {
                $validated = validator($data, [
                    'titre' => 'required|string',
                    'description' => 'required|string',
                    'statut' => 'required|string|in:en_attente,traité,rejeté',
                    'user_id' => 'required|exists:users,id',
                ])->validate();
                
                $reclamation = new Reclamation();
                $reclamation->titre = $validated['titre'];
                $reclamation->description = $validated['description'];
                $reclamation->statut = $validated['statut'];
                $reclamation->user_id = $validated['user_id'];
                $reclamation->save();
                
                $created[] = $reclamation;
            }
            
            return response()->json($created, 201);
        } else {
            // Traitement d'une seule réclamation
            $validated = $request->validate([
                'titre' => 'required|string',
                'description' => 'required|string',
                'statut' => 'required|string|in:en_attente,traité,rejeté',
                'user_id' => 'required|exists:users,id',
            ]);

            $reclamation = new Reclamation();
            $reclamation->titre = $validated['titre'];
            $reclamation->description = $validated['description'];
            $reclamation->statut = $validated['statut'];
            $reclamation->user_id = $validated['user_id'];
            $reclamation->save();

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
            'statut' => 'required|string|in:en_attente,traité,rejeté',
            'user_id' => 'required|exists:users,id',
        ]);

        $reclamation->titre = $validated['titre'];
        $reclamation->description = $validated['description'];
        $reclamation->statut = $validated['statut'];
        $reclamation->user_id = $validated['user_id'];
        $reclamation->save();

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
