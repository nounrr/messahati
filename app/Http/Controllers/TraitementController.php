<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Traitement;

class TraitementController extends Controller
{
    // Liste des traitements
    public function index()
    {
        $traitements = Traitement::all();
        return response()->json($traitements);
    }

    // Formulaire de création (vide si API frontend)
    public function create()
    {
        // Peut être ignoré si API
    }

    // Enregistre plusieurs traitements (sans ::create)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'traitements' => 'required|array',
            'traitements.*.typetraitement_id' => 'required|exists:typetraitements,id',
            'traitements.*.description' => 'required|string',
            'traitements.*.date_debut' => 'required|date',
            'traitements.*.date_fin' => 'required|date',
        ]);

        $created = [];

        foreach ($validated['traitements'] as $data) {
            $traitement = new Traitement();
            $traitement->typetraitement_id = $data['typetraitement_id'];
            $traitement->description = $data['description'];
            $traitement->date_debut = $data['date_debut'];
            $traitement->date_fin = $data['date_fin'];
            $traitement->save();

            $created[] = $traitement;
        }

        return response()->json($created, 201);
    }

    // Affiche un traitement spécifique
    public function show(string $id)
    {
        $traitement = Traitement::findOrFail($id);
        return response()->json($traitement);
    }

    // Formulaire d’édition (vide si API)
    public function edit(string $id)
    {
        // Peut être ignoré si API
    }

    // Mise à jour (champ par champ, pas de update($data))
    public function update(Request $request, Traitement $traitement)
    {
        $validated = $request->validate([
            'typetraitement_id' => 'required|exists:typetraitements,id',
            'description' => 'required|string',
            'date_debut' => 'required|date',
            'date_fin' => 'required|date',
        ]);

        $traitement->typetraitement_id = $validated['typetraitement_id'];
        $traitement->description = $validated['description'];
        $traitement->date_debut = $validated['date_debut'];
        $traitement->date_fin = $validated['date_fin'];
        $traitement->save();

        return response()->json($traitement, 200);
    }

    // Suppression
    public function destroy(string $id)
    {
        $traitement = Traitement::findOrFail($id);
        $traitement->delete();

        return response()->json(['message' => 'Traitement supprimé avec succès.']);
    }
}
