<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Departement;
use App\Exports\DepartementExport;
use App\Imports\DepartementImport;
use App\Traits\ExcelExportImport;  // <-- Excel specific

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
        ]);

        foreach ($validatedData['departements'] as $data) {
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
        ]);

        foreach ($validatedData['departements'] as $data) {
            $departement = Departement::find($data['id']);
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

    use ExcelExportImport;

    // Export and import methods
    public function export()
    {
        return $this->exportExcel(DepartementExport::class, 'departements.xlsx', Departement::all());
    }
    

    public function import(Request $request)
    {
        $this->importExcel($request->file('file'), DepartementImport::class);
        return response()->json(['message' => 'Départements importés avec succès.']);
    }
}
