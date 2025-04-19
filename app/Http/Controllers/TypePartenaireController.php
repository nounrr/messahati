<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TypePartenaire;

class TypePartenaireController extends Controller
{
    // Liste des types de partenaires
    public function index()
    {
        $types = TypePartenaire::all();
        return response()->json($types);
    }

    // Formulaire de création
    public function create()
    {
        return view('type-partenaires.create');
    }

    // Enregistrement de plusieurs types de partenaires
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'types' => 'required|array',
            'types.*.nom' => 'required|string|max:255',
            'types.*.description' => 'nullable|string',
        ]);

        $createdItems = [];

        foreach ($validatedData['types'] as $data) {
            $type = new TypePartenaire();
            $type->nom = $data['nom'];
            $type->description = $data['description'] ?? null;
            $type->save();
            
            $createdItems[] = $type;
        }

        return response()->json($createdItems, 201);
    }

    // Affiche un type spécifique
    public function show(string $id)
    {
        $type = TypePartenaire::findOrFail($id);
        return response()->json($type);
    }

    // Formulaire d'édition
    public function edit(string $id)
    {
        $type = TypePartenaire::findOrFail($id);
        return view('type-partenaires.edit', compact('type'));
    }

    // Mise à jour de plusieurs types de partenaires
    public function update(Request $request, $id)
    {
        try {
            $validatedData = $request->validate([
                'id' => 'required|exists:type_partenaires,id',
                'nom' => 'required|string|max:255',
                'description' => 'nullable|string',
            ]);

            $type = TypePartenaire::findOrFail($id);
            $type->update($validatedData);

            return response()->json(['message' => 'Types de partenaires mis à jour avec succès.']);
        } catch (\Exception $e) {
            \Log::error('Erreur lors de la mise à jour du type partenaire: ' . $e->getMessage());
            return response()->json(['error' => 'Erreur lors de la mise à jour: ' . $e->getMessage()], 500);
        }
    }

    // Suppression d'un ou plusieurs types
    public function destroy(Request $request, string $id = null)
    {
        if ($id) {
            $type = TypePartenaire::findOrFail($id);
            $type->delete();
        } else {
            $validatedData = $request->validate([
                'ids' => 'required|array',
                'ids.*' => 'required|exists:type_partenaires,id',
            ]);

            TypePartenaire::whereIn('id', $validatedData['ids'])->delete();
        }

        return response()->json(['message' => 'Types de partenaires supprimés avec succès.']);
    }
}
