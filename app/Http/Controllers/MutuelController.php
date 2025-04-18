<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Mutuel;

class MutuelController extends Controller
{
    // Affiche toutes les mutuelles avec leurs utilisateurs liés
    public function index()
    {
        $mutuels = Mutuel::with('user')->get();
        return response()->json($mutuels);
    }

    // Affiche le formulaire de création
    public function create()
    {
        return view('mutuel.create');
    }

    // Enregistre une ou plusieurs mutuelles sans mass-assignement
    public function store(Request $request)
    {
        $validated = $request->validate([
            'mutuels' => 'required|array',
            'mutuels.*.nom_mutuel' => 'required|string'
        ]);

        $createdItems = [];

        foreach ($validated['mutuels'] as $data) {
            $mutuel = new Mutuel();
            $mutuel->nom_mutuel = $data['nom_mutuel'];
            $mutuel->save();

            $createdItems[] = $mutuel;
        }

        return response()->json($createdItems, 201);
    }

    // Affiche une mutuelle spécifique
    public function show($id)
    {
        $mutuel = Mutuel::with('user')->findOrFail($id);
        return view('mutuel.show', compact('mutuel'));
    }

    // Affiche le formulaire d’édition
    public function edit($id)
    {
        $mutuel = Mutuel::findOrFail($id);
        return view('mutuel.edit', compact('mutuel'));
    }

    // Met à jour une ou plusieurs mutuelles sans mass-assignement
    public function update(Request $request)
    {
        $validated = $request->validate([
            'updates' => 'required|array',
            'updates.*.id' => 'required|exists:mutuels,id',
            'updates.*.nom_mutuel' => 'required|string'
        ]);

        $updatedItems = [];

        foreach ($validated['updates'] as $data) {
            $mutuel = Mutuel::findOrFail($data['id']);
            $mutuel->nom_mutuel = $data['nom_mutuel'];
            $mutuel->save();

            $updatedItems[] = $mutuel;
        }

        return response()->json($updatedItems, 200);
    }

    // Supprime une mutuelle
    public function destroy($id)
    {
        Mutuel::findOrFail($id)->delete();
        return redirect()->route('mutuel.index')->with('success', 'Mutuelle supprimée avec succès.');
    }
}
