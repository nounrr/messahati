<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Partenaire;

class PartenaireController extends Controller
{
    // Affiche tous les partenaires
    public function index()
    {
        $partenaires = Partenaire::all();
        return response()->json($partenaires);
    }

    // Formulaire de création
    public function create()
    {
        return view('partenaires.create');
    }

    // Enregistrement sans mass-assignement
    public function store(Request $request)
    {
        $validated = $request->validate([
            'partenaires' => 'required|array',
            'partenaires.*.nom' => 'required|string',
            'partenaires.*.adress' => 'nullable|string',
            'partenaires.*.typepartenaires_id' => 'required|exists:type_partenaires,id',
            'partenaires.*.telephone' => 'nullable|string'
        ]);

        $createdItems = [];

        foreach ($validated['partenaires'] as $data) {
            $partenaire = new Partenaire();
            $partenaire->nom = $data['nom'];
            $partenaire->adress = $data['adress'] ?? null;
            $partenaire->typepartenaires_id = $data['typepartenaires_id'];
            $partenaire->telephone = $data['telephone'] ?? null;
            $partenaire->save();
            $createdItems[] = $partenaire;
        }

        return response()->json($createdItems, 201);
    }

    // Affiche un partenaire spécifique
    public function show(string $id)
    {
        $partenaire = Partenaire::findOrFail($id);
        return response()->json($partenaire);
    }

    // Formulaire d'édition
    public function edit(string $id)
    {
        $partenaire = Partenaire::findOrFail($id);
        return view('partenaires.edit', compact('partenaire'));
    }

    // Mise à jour sans mass-assignement
    public function update(Request $request)
    {
        $validated = $request->validate([
            'updates' => 'required|array',
            'updates.*.id' => 'required|exists:partenaires,id',
            'updates.*.nom' => 'required|string',
            'updates.*.adress' => 'nullable|string',
            'updates.*.typepartenaires_id' => 'required|exists:typepartenairess,id',
            'updates.*.telephone' => 'nullable|string'
        ]);

        $updatedItems = [];

        foreach ($validated['updates'] as $data) {
            $partenaire = Partenaire::find($data['id']);
            $partenaire->nom = $data['nom'];
            $partenaire->adress = $data['adress'] ?? null;
            $partenaire->typepartenaires_id = $data['typepartenaires_id'];
            $partenaire->telephone = $data['telephone'] ?? null;
            $partenaire->save();
            $updatedItems[] = $partenaire;
        }

        return response()->json($updatedItems, 200);
    }

    // Suppression d'un ou plusieurs partenaires
    public function destroy(Request $request, string $id = null)
    {
        if ($id) {
            $partenaire = Partenaire::findOrFail($id);
            $partenaire->delete();
        } else {
            $validatedData = $request->validate([
                'ids' => 'required|array',
                'ids.*' => 'required|exists:partenaires,id',
            ]);

            Partenaire::whereIn('id', $validatedData['ids'])->delete();
        }

        return response()->json(['message' => 'Partenaires supprimés avec succès.']);
    }
}
