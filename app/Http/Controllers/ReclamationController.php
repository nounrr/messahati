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
        return view('reclamation.index', compact('reclamations'));
    }

    // Formulaire de création
    public function create()
    {
        return view('reclamation.create');
    }

    // Enregistrement d'une réclamation (sans mass-assignement)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'titre' => 'required|string',
            'description' => 'required|string',
            'statut' => 'required|string|in:en_attente,traité,rejeté',
            'date_reclamation' => 'required|date',
        ]);

        $reclamation = new Reclamation();
        $reclamation->titre = $validated['titre'];
        $reclamation->description = $validated['description'];
        $reclamation->statut = $validated['statut'];
        $reclamation->date_reclamation = $validated['date_reclamation'];
        $reclamation->user_id = Auth::id(); // Ajoute l'utilisateur connecté
        $reclamation->save();

        return redirect()->route('reclamation.index')->with('success', 'Réclamation créée avec succès.');
    }

    // Affiche une réclamation
    public function show($id)
    {
        $reclamation = Reclamation::with('user')->findOrFail($id);
        return view('reclamation.show', compact('reclamation'));
    }

    // Formulaire d'édition
    public function edit($id)
    {
        $reclamation = Reclamation::findOrFail($id);
        return view('reclamation.edit', compact('reclamation'));
    }

    // Mise à jour d'une réclamation (sans mass-assignement)
    public function update(Request $request, $id)
    {
        $reclamation = Reclamation::findOrFail($id);

        $validated = $request->validate([
            'titre' => 'required|string',
            'description' => 'required|string',
            'statut' => 'required|string|in:en_attente,traité,rejeté',
            'date_reclamation' => 'required|date',
        ]);

        $reclamation->titre = $validated['titre'];
        $reclamation->description = $validated['description'];
        $reclamation->statut = $validated['statut'];
        $reclamation->date_reclamation = $validated['date_reclamation'];
        $reclamation->save();

        return redirect()->route('reclamation.index')->with('success', 'Réclamation mise à jour avec succès.');
    }

    // Suppression d'une réclamation
    public function destroy($id)
    {
        Reclamation::findOrFail($id)->delete();
        return redirect()->route('reclamation.index')->with('success', 'Réclamation supprimée avec succès.');
    }
}
