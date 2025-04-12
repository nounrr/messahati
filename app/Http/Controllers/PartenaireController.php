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
            'partenaires.*.clinique_id' => 'required|exists:cliniques,id',
            'partenaires.*.nom' => 'required|string',
            'partenaires.*.adress' => 'required|string',
            'partenaires.*.typepartenaires_id' => 'required|exists:typepartenairess,id',
            'partenaires.*.telephone' => 'required|string'
        ]);

        $createdItems = [];

        foreach ($validated['partenaires'] as $data) {
            $partenaire = new Partenaire();
            $partenaire->clinique_id = $data['clinique_id'];
            $partenaire->nom = $data['nom'];
            $partenaire->adress = $data['adress'];
            $partenaire->typepartenaires_id = $data['typepartenaires_id'];
            $partenaire->telephone = $data['telephone'];
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

    // Formulaire d’édition
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
            'updates.*.clinique_id' => 'required|exists:cliniques,id',
            'updates.*.nom' => 'required|string',
            'updates.*.adress' => 'required|string',
            'updates.*.typepartenaires_id' => 'required|exists:typepartenairess,id',
            'updates.*.telephone' => 'required|string'
        ]);

        $updatedItems = [];

        foreach ($validated['updates'] as $data) {
            $partenaire = Partenaire::findOrFail($data['id']);
            $partenaire->clinique_id = $data['clinique_id'];
            $partenaire->nom = $data['nom'];
            $partenaire->adress = $data['adress'];
            $partenaire->typepartenaires_id = $data['typepartenaires_id'];
            $partenaire->telephone = $data['telephone'];
            $partenaire->save();

            $updatedItems[] = $partenaire;
        }

        return response()->json($updatedItems, 200);
    }

    // Suppression d’un ou plusieurs partenaires
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
