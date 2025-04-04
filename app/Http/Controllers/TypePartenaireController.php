<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TypePartenaire;

class TypePartenaireController extends Controller
{
    public function index()
    {
        $types = TypePartenaire::all();
        return response()->json($types);
    }

    public function create()
    {
        return view('type-partenaires.create');
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'types' => 'required|array',
            'types.*.nom' => 'required|string|max:255',
            'types.*.description' => 'nullable|string',
        ]);

        foreach ($validatedData['types'] as $data) {
            TypePartenaire::create($data);
        }

        return response()->json(['message' => 'Types de partenaires créés avec succès.']);
    }

    public function show(string $id)
    {
        $type = TypePartenaire::findOrFail($id);
        return response()->json($type);
    }

    public function edit(string $id)
    {
        $type = TypePartenaire::findOrFail($id);
        return view('type-partenaires.edit', compact('type'));
    }

    public function update(Request $request, string $id = null)
    {
        $validatedData = $request->validate([
            'types' => 'required|array',
            'types.*.id' => 'required|exists:type_partenaires,id',
            'types.*.nom' => 'required|string|max:255',
            'types.*.description' => 'nullable|string',
        ]);

        foreach ($validatedData['types'] as $data) {
            $type = TypePartenaire::find($data['id']);
            $type->update($data);
        }

        return response()->json(['message' => 'Types de partenaires mis à jour avec succès.']);
    }

    public function destroy(Request $request, string $id = null)
    {
        if ($id) {
            $type = TypePartenaire::findOrFail($id);
            $type->delete();
        } else {
            $validatedData = $request->validate([
                'ids' => 'required|array',
                'ids.*' => 'required|exists:type_partenaires,id',
            ]);

            TypePartenaire::whereIn('id', $validatedData['ids'])->delete();
        }

        return response()->json(['message' => 'Types de partenaires supprimés avec succès.']);
    }
}
