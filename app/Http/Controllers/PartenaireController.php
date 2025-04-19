<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Partenaire;

class PartenaireController extends Controller
{
    // Affiche tous les partenaires
    public function index()
    {
        $partenaires = Partenaire::with('type_partenaire')->get();
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
            'nom' => 'required|string',
            'adress' => 'nullable|string',
            'typepartenaires_id' => 'required|exists:type_partenaires,id',
            'telephone' => 'nullable|string'
        ]);

        $partenaire = Partenaire::create($validated);
        $partenaire->load('type_partenaire');

        return response()->json($partenaire, 201);
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
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'nom' => 'required|string',
            'adress' => 'nullable|string',
            'typepartenaires_id' => 'required|exists:type_partenaires,id',
            'telephone' => 'nullable|string'
        ]);

        $partenaire = Partenaire::findOrFail($id);
        $partenaire->update($validated);
        $partenaire->load('type_partenaire');

        return response()->json($partenaire);
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
