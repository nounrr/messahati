<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Ordonance;

class OrdonanceController extends Controller
{
    // Affiche la liste des ordonnances
    public function index()
    {
        $ordonances = Ordonance::all();
        return response()->json($ordonances);
    }

    // Affiche le formulaire de création
    public function create()
    {
        return view('ordonances.create');
    }

    // Enregistre plusieurs ordonnances (instanciation manuelle)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'ordonances' => 'required|array',
            'ordonances.*.date_emission' => 'required|date',
            'ordonances.*.description' => 'required|string',
            'ordonances.*.traitement_id' => 'required|exists:traitements,id'
        ]);

        $createdItems = [];

        foreach ($validated['ordonances'] as $data) {
            $ordonance = new Ordonance();
            $ordonance->date_emission = $data['date_emission'];
            $ordonance->description = $data['description'];
            $ordonance->traitement_id = $data['traitement_id'];
            $ordonance->save();

            $createdItems[] = $ordonance;
        }

        return response()->json($createdItems, 201);
    }

    // Affiche une ordonnance spécifique
    public function show(string $id)
    {
        $ordonance = Ordonance::findOrFail($id);
        return response()->json($ordonance);
    }

    // Affiche le formulaire d’édition
    public function edit(string $id)
    {
        $ordonance = Ordonance::findOrFail($id);
        return view('ordonances.edit', compact('ordonance'));
    }

    // Met à jour plusieurs ordonnances (instanciation + affectation directe)
    public function update(Request $request)
    {
        $validated = $request->validate([
            'updates' => 'required|array',
            'updates.*.id' => 'required|exists:ordonances,id',
            'updates.*.date_emission' => 'required|date',
            'updates.*.description' => 'required|string',
            'updates.*.traitement_id' => 'required|exists:traitements,id'
        ]);

        $updatedItems = [];

        foreach ($validated['updates'] as $data) {
            $ordonance = Ordonance::findOrFail($data['id']);
            $ordonance->date_emission = $data['date_emission'];
            $ordonance->description = $data['description'];
            $ordonance->traitement_id = $data['traitement_id'];
            $ordonance->save();

            $updatedItems[] = $ordonance;
        }

        return response()->json($updatedItems, 200);
    }

    // Supprime une ou plusieurs ordonnances
    public function destroy(Request $request, string $id = null)
    {
        if ($id) {
            $ordonance = Ordonance::findOrFail($id);
            $ordonance->delete();
        } else {
            $validatedData = $request->validate([
                'ids' => 'required|array',
                'ids.*' => 'required|exists:ordonances,id',
            ]);

            Ordonance::whereIn('id', $validatedData['ids'])->delete();
        }

        return response()->json(['message' => 'Ordonnances supprimées avec succès.']);
    }
}
