<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Mutuel;

class MutuelController extends Controller
{
    // Affiche toutes les mutuelles avec leurs utilisateurs liés
    public function index()
    {
        $mutuels = Mutuel::all();
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
        $mutuel = Mutuel::findOrFail($id);
        return response()->json($mutuel);
    }

    // Affiche le formulaire d'édition
    public function edit($id)
    {
        $mutuel = Mutuel::findOrFail($id);
        return view('mutuel.edit', compact('mutuel'));
    }

    // Met à jour une mutuelle
    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'nom_mutuel' => 'required|string'
        ]);

        $mutuel = Mutuel::findOrFail($id);
        $mutuel->nom_mutuel = $validated['nom_mutuel'];
        $mutuel->save();

        return response()->json($mutuel, 200);
    }

    // Supprime une mutuelle
    public function destroy(Request $request, string $id = null)
    {
        try {
            if ($id) {
                // Suppression unique
                $mutuel = Mutuel::findOrFail($id);
                $mutuel->delete();
                return response()->json(['message' => 'Mutuelle supprimée avec succès']);
            } else {
                // Suppression multiple
                $ids = $request->validate([
                    'ids' => 'required|array',
                    'ids.*' => 'required|integer|exists:mutuels,id'
                ])['ids'];
                
                Mutuel::whereIn('id', $ids)->delete();
                return response()->json(['message' => 'Mutuelles supprimées avec succès']);
            }
        } catch (\Exception $e) {
            return response()->json(['message' => 'Erreur lors de la suppression', 'error' => $e->getMessage()], 500);
        }
    }
}
