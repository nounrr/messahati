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
        ]);

        foreach ($validatedData['types'] as $data) {
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
        ]);

        foreach ($validatedData['types'] as $data) {
            $type = TypeTraitement::find($data['id']);
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
}
