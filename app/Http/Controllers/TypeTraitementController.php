<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TypeTraitement;
use App\Traits\ExcelExportImport;

class TypeTraitementController extends Controller
{
    // Affiche tous les types de traitements
    public function index()
    {
        $types = TypeTraitement::all();
        return response()->json($types);
    }

    // Formulaire de création (si utilisé avec Blade)
    public function create()
    {
        return view('type-traitements.create');
    }

    // Enregistrement de plusieurs types de traitements (sans mass-assignement)
    public function store(Request $request)
    {

        $validated = $request->validate([
            'typetraitements' => 'required|array',
            'typetraitements.*.nom' => 'required|string',
            'typetraitements.*.prix-default' => 'nullable|numeric'
        ]);

        $createdItems = [];

        foreach ($validated['typetraitements'] as $data) {
            $type = new TypeTraitement();
            $type->nom = $data['nom'];
            $type->{'prix-default'} = $data['prix-default'] ?? null;
            $type->save();

            $createdItems[] = $type;
        }

        return response()->json($createdItems, 201);
    }

    // Formulaire d'édition
    public function edit(string $id)
    {
        $type = TypeTraitement::findOrFail($id);
        return view('type-traitements.edit', compact('type'));
    }

    // Mise à jour de plusieurs types de traitements
    public function update(Request $request)
    {
        $validated = $request->validate([
            'updates' => 'required|array',
            'updates.*.id' => 'required|exists:typetraitements,id',
            'updates.*.nom' => 'required|string',
            'updates.*.prix-default' => 'nullable|numeric'
        ]);

        $updatedItems = [];

        foreach ($validated['updates'] as $data) {
            $type = TypeTraitement::findOrFail($data['id']);
            $type->nom = $data['nom'];
            $type->{'prix-default'} = $data['prix-default'] ?? null;
            $type->save();

            $updatedItems[] = $type;
        }

        return response()->json($updatedItems, 200);
    }

    // Suppression d'un ou plusieurs types
    public function destroy(Request $request, string $id = null)
    {
        if ($id) {
            $type = TypeTraitement::findOrFail($id);
            $type->delete();
        } else {
            $validatedData = $request->validate([
                'ids' => 'required|array',
                'ids.*' => 'required|exists:type_traitements,id',
            ]);

            TypeTraitement::whereIn('id', $validatedData['ids'])->delete();
        }

        return response()->json(['message' => 'Types de traitements supprimés avec succès.']);
    }

    use ExcelExportImport;

    // Export and import methods
    public function export()
    {
        return $this->exportExcel(TypeTraitementExport::class, 'type_traitements.xlsx', TypeTraitement::all());
    }

    public function import(Request $request)
    {
        $this->importExcel($request->file('file'), TypeTraitementImport::class);
        return response()->json(['message' => 'Types de traitements importés avec succès.']);
    }
}
