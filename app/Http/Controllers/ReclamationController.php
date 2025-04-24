<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Reclamation;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class ReclamationController extends Controller
{
    // Liste des réclamations
    public function index(Request $request)
    {
        // Vérifier si un ID utilisateur est fourni
        if ($request->has('user_id')) {
            $userId = $request->input('user_id');
            
            // Récupérer les réclamations pour cet utilisateur
            $reclamations = Reclamation::with('user')
                ->where('user_id', $userId)
                ->get();
            return response()->json($reclamations);
        }
        
        // Sinon, récupérer toutes les réclamations
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
        // Vérifier simplement si l'utilisateur est authentifié mais ne pas bloquer
        $isAuthenticated = Auth::check();
        
        //  si l'utilisateur n'est pas authentifié
        if (!$isAuthenticated) {
        }
        
        // Récupérer l'ID utilisateur envoyé par le frontend
        $userId = null;
        
        // Vérifier si la requête contient un tableau de réclamations
        if (is_array($request->all()) && !isset($request->all()['titre'])) {
            $reclamations = $request->all();
            $created = [];
            
            foreach ($reclamations as $data) {
                // Valider les données
                $validated = validator($data, [
                    'titre' => 'required|string',
                    'description' => 'required|string',
                    'user_id' => 'required|integer|exists:users,id',
                ])->validate();
                
                // Utiliser l'ID utilisateur du frontend
                $userId = $validated['user_id'];
                
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
                'user_id' => 'required|integer|exists:users,id',
            ]);

            // Utiliser l'ID utilisateur du frontend
            $userId = $validated['user_id'];
            
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
            'user_id' => 'sometimes|required|integer|exists:users,id',
        ]);

        $reclamation->titre = $validated['titre'];
        $reclamation->description = $validated['description'];
        
        // Mettre à jour l'user_id si fourni
        if (isset($validated['user_id'])) {
            $reclamation->user_id = $validated['user_id'];
        }
        
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
