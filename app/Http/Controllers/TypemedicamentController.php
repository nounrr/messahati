<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TypeMedicament;

class TypeMedicamentController extends Controller
{
    // Liste des types de médicaments
    public function index()
    {
        $types = TypeMedicament::all();
        return response()->json($types);
    }

    // Formulaire de création (si utilisé côté Blade)
    public function create()
    {
        return view('typemedicaments.create');
    }

    // Enregistrement de plusieurs types
    public function store(Request $request)
    {
        $validated = $request->validate([
            'typemedicaments' => 'required|array',
            'typemedicaments.*.nom' => 'required|string',
        ]);

        $created = [];

        foreach ($validated['typemedicaments'] as $data) {
            $type = new TypeMedicament();
            $type->nom = $data['nom'];
            $type->save();

            $created[] = $type;
        }

        return response()->json($created, 201);
    }

    // Affiche un type spécifique
    public function show($id)
    {
        $type = TypeMedicament::findOrFail($id);
        return response()->json($type);
    }

    // Formulaire d'édition
    public function edit($id)
    {
        $type = TypeMedicament::findOrFail($id);
        return view('typemedicaments.edit', compact('type'));
    }

    // Mise à jour de plusieurs types
    public function update(Request $request)
    {
        $validated = $request->validate([
            'typemedicaments' => 'required|array',
            'typemedicaments.*.id' => 'required|exists:type_medicaments,id',
            'typemedicaments.*.nom' => 'required|string',
        ]);

        $updated = [];

        foreach ($validated['typemedicaments'] as $data) {
            $type = TypeMedicament::findOrFail($data['id']);
            $type->nom = $data['nom'];
            $type->save();

            $updated[] = $type;
        }

        return response()->json($updated, 200);
    }

    // Suppression
    public function destroy($id)
    {
        $type = TypeMedicament::findOrFail($id);
        $type->delete();

        return response()->json(['message' => 'Type de médicament supprimé avec succès.'], 200);
    }
}
