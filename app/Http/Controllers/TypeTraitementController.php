<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TypeTraitement;

class TypeTraitementController extends Controller
{
    public function index()
    {
        $types = TypeTraitement::all();
        return response()->json($types);
    }

    public function create()
    {
        return view('type-traitements.create');
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'types' => 'required|array',
            'types.*.nom' => 'required|string|max:255',
            'types.*.description' => 'nullable|string',
            'types.*.image' => 'nullable|file|image|max:2048',
        ]);

        foreach ($validatedData['types'] as $data) {
            if (isset($data['image'])) {
                $data['image_path'] = $data['image']->store('images/type-traitements', 'public');
            }
            TypeTraitement::create($data);
        }

        return response()->json(['message' => 'Types de traitements créés avec succès.']);
    }

    public function show(string $id)
    {
        $type = TypeTraitement::findOrFail($id);
        return response()->json($type);
    }

    public function edit(string $id)
    {
        $type = TypeTraitement::findOrFail($id);
        return view('type-traitements.edit', compact('type'));
    }

    public function update(Request $request, string $id = null)
    {
        $validatedData = $request->validate([
            'types' => 'required|array',
            'types.*.id' => 'required|exists:type_traitements,id',
            'types.*.nom' => 'required|string|max:255',
            'types.*.description' => 'nullable|string',
            'types.*.image' => 'nullable|file|image|max:2048',
        ]);

        foreach ($validatedData['types'] as $data) {
            $type = TypeTraitement::find($data['id']);
            if (isset($data['image'])) {
                if ($type->image_path && Storage::disk('public')->exists($type->image_path)) {
                    Storage::disk('public')->delete($type->image_path);
                }
                $data['image_path'] = $data['image']->store('images/type-traitements', 'public');
            }
            $type->update($data);
        }

        return response()->json(['message' => 'Types de traitements mis à jour avec succès.']);
    }

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
