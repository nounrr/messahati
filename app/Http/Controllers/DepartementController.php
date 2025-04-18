<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Departement;
use App\Exports\DepartementExport;
use App\Imports\DepartementImport;
use App\Traits\ExcelExportImport;  // <-- Excel specific

use Illuminate\Support\Facades\Storage;

class DepartementController extends Controller
{
    use ExcelExportImport;  // <-- Add this line to use the trait

    // Récupère et retourne tous les départements
    public function index()
    {
        $clinique_id = auth()->user()->clinique_id;
        $departements = Departement::where('clinique_id', $clinique_id)->get();
        return response()->json($departements);
    }

    // Retourne une vue pour créer un département
    public function create()
    {
        return view('departements.create');
    }

    // Enregistre un ou plusieurs départements (sans mass-assignement)
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'departements' => 'required|array',
            'departements.*.nom' => 'required|string|max:255',
            'departements.*.description' => 'nullable|string',
            'departements.*.image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $clinique_id = auth()->user()->clinique_id;

        foreach ($validatedData['departements'] as $key => $data) {
            $departement = new Departement();
            $departement->clinique_id = $clinique_id;
            $departement->nom = $data['nom'];
            $departement->description = $data['description'] ?? null;

            if ($request->hasFile("departements.$key.image")) {
                $file = $request->file("departements.$key.image");
                $path = $file->store('departements', 'public');
                $departement->img_path = $path;
            }

            $departement->save();
        }

        return response()->json(['message' => 'Départements créés avec succès.']);
    }

    // Affiche un département spécifique
    public function show(string $id)
    {
        $departement = Departement::findOrFail($id);
        return response()->json($departement);
    }

    // Retourne une vue pour modifier un département
    public function edit(string $id)
    {
        $departement = Departement::findOrFail($id);
        return view('departements.edit', compact('departement'));
    }

    // Met à jour un ou plusieurs départements sans mass-assignement
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

            $departement->nom = $data['nom'];
            $departement->description = $data['description'] ?? null;

            if ($request->hasFile("departements.$key.image")) {
                $file = $request->file("departements.$key.image");
                $path = $file->store('departements', 'public');
                $departement->img_path = $path;
            }

            $departement->save();
        }

        return response()->json(['message' => 'Départements mis à jour avec succès.']);
    }

    // Supprime un ou plusieurs départements
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

    public function export()
    {
        return $this->exportExcel(DepartementExport::class, 'departements.xlsx', Departement::all());
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,xlsx',
        ]);

        $this->importExcel($request->file('file'), DepartementImport::class);

        return response()->json(['message' => 'Départements importés avec succès.']);
    }
}
