<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Departement;

class DepartementController extends Controller
{
    // Récupère et retourne tous les départements
    public function index()
    {
        $departements = Departement::all();
        return response()->json($departements);
    }

    // Retourne une vue pour créer un département ou plusieurs (si nécessaire)
    public function create()
    {
        return view('departements.create');
    }

    // Valide et enregistre un nouveau département
    public function store(Request $request)
{
    $validatedData = $request->validate([
        'departements' => 'required|array',
        'departements.*.nom' => 'required|string|max:255',
        'departements.*.description' => 'nullable|string',
        'departements.*.image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
    ]);

    foreach ($validatedData['departements'] as $key => $data) {
        if ($request->hasFile("departements.$key.image")) {
            $file = $request->file("departements.$key.image");
            $path = $file->store('departements', 'public');
            $data['img_path'] = $path;
        }

        Departement::create($data);
    }

    return response()->json(['message' => 'Départements créés avec succès.']);
}


    // Retourne les détails d'un département spécifique
    public function show(string $id)
    {
        $departement = Departement::findOrFail($id);
        return response()->json($departement);
    }

    // Retourne une vue pour modifier un département (si nécessaire)
    public function edit(string $id)
    {
        $departement = Departement::findOrFail($id);
        return view('departements.edit', compact('departement'));
    }

    // Met à jour un département ou plusieurs existants
    public function update(Request $request, string $id = null)
{
    $validatedData = $request->validate([
        'departements' => 'required|array',
        'departements.*.id' => 'required|exists:departements,id',
        'departements.*.nom' => 'required|string|max:255',
        'departements.*.description' => 'nullable|string',
        'departements.*.image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
    ]);

    foreach ($validatedData['departements'] as $key => $data) {
        $departement = Departement::find($data['id']);

        if ($request->hasFile("departements.$key.image")) {
            $file = $request->file("departements.$key.image");
            $path = $file->store('departements', 'public');
            $data['img_path'] = $path;
        }

        $departement->update($data);
    }

    return response()->json(['message' => 'Départements mis à jour avec succès.']);
}

    // Supprime un département ou plusieurs spécifiques
    public function destroy(Request $request, string $id = null)
    {
        if ($id) {
            $departement = Departement::findOrFail($id);
            $departement->delete();
        } else {
            $validatedData = $request->validate([
                'ids' => 'required|array',
                'ids.*' => 'required|exists:departements,id',
            ]);

            Departement::whereIn('id', $validatedData['ids'])->delete();
        }

        return response()->json(['message' => 'Départements supprimés avec succès.']);
    }
}
