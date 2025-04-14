<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Medicament;

class MedicamentController extends Controller
{
    /**
     * Affiche la liste des médicaments.
     */
    public function index()
    {
        $medicaments = Medicament::all();
        return response()->json($medicaments);
    }

    /**
     * Affiche le formulaire de création.
     */
    public function create()
    {
        return view('medicaments.create');
    }

    /**
     * Enregistre de nouveaux médicaments (instanciation sans mass-assignement).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'medicaments' => 'required|array',
            'medicaments.*.nom' => 'required|string',
            'medicaments.*.prix' => 'required|numeric',
            'medicaments.*.description' => 'nullable|string',
            'medicaments.*.typemedicaments_id' => 'required|exists:typemedicaments,id',
            'medicaments.*.image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $created = [];

        foreach ($validated['medicaments'] as $index => $data) {
            $medicament = new Medicament();
            $medicament->nom = $data['nom'];
            $medicament->prix = $data['prix'];
            $medicament->description = $data['description'] ?? null;
            $medicament->typemedicaments_id = $data['typemedicaments_id'];

            if ($request->hasFile("medicaments.$index.image")) {
                $file = $request->file("medicaments.$index.image");
                $filename = time() . '_' . $file->getClientOriginalName();
                $file->storeAs('public/images', $filename);
                $medicament->image = $filename;
            }

            $medicament->save();
            $created[] = $medicament;
        }

        return response()->json($created, 201);
    }

    /**
     * Affiche un médicament spécifique.
     */
    public function show($id)
    {
        $medicament = Medicament::findOrFail($id);
        return response()->json($medicament);
    }

    /**
     * Affiche le formulaire d’édition.
     */
    public function edit($id)
    {
        $medicament = Medicament::findOrFail($id);
        return view('medicaments.edit', compact('medicament'));
    }

    /**
     * Met à jour des médicaments (sans mass-assignement).
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'medicaments' => 'required|array',
            'medicaments.*.id' => 'required|exists:medicaments,id',
            'medicaments.*.nom' => 'required|string',
            'medicaments.*.prix' => 'required|numeric',
            'medicaments.*.description' => 'nullable|string',
            'medicaments.*.typemedicaments_id' => 'required|exists:typemedicaments,id',
            'medicaments.*.image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $updated = [];

        foreach ($validated['medicaments'] as $index => $data) {
            $medicament = Medicament::findOrFail($data['id']);

            $medicament->nom = $data['nom'];
            $medicament->prix = $data['prix'];
            $medicament->description = $data['description'] ?? null;
            $medicament->typemedicaments_id = $data['typemedicaments_id'];

            if ($request->hasFile("medicaments.$index.image")) {
                $file = $request->file("medicaments.$index.image");
                $filename = time() . '_' . $file->getClientOriginalName();
                $file->storeAs('public/images', $filename);
                $medicament->image = $filename;
            }

            $medicament->save();
            $updated[] = $medicament;
        }

        return response()->json($updated, 200);
    }

    /**
     * Supprime un médicament.
     */
    public function destroy($id)
    {
        $medicament = Medicament::findOrFail($id);
        $medicament->delete();

        return redirect()->route('medicaments.index')->with('success', 'Médicament supprimé avec succès.');
    }
}
