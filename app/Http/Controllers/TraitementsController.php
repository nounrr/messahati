<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Traitement;

class TraitementsController extends Controller
{
    public function index()
    {
        $traitements = Traitement::all();
        return response()->json($traitements);
    }

    public function create()
    {
        return view('traitements.create');
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'traitements' => 'required|array',
            'traitements.*.nom' => 'required|string|max:255',
            'traitements.*.description' => 'nullable|string',
        ]);

        foreach ($validatedData['traitements'] as $data) {
            Traitement::create($data);
        }

        return response()->json(['message' => 'Traitements créés avec succès.']);
    }

    public function show(string $id)
    {
        $traitement = Traitement::findOrFail($id);
        return response()->json($traitement);
    }

    public function edit(string $id)
    {
        $traitement = Traitement::findOrFail($id);
        return view('traitements.edit', compact('traitement'));
    }

    public function update(Request $request, string $id = null)
    {
        $validatedData = $request->validate([
            'traitements' => 'required|array',
            'traitements.*.id' => 'required|exists:traitements,id',
            'traitements.*.nom' => 'required|string|max:255',
            'traitements.*.description' => 'nullable|string',
        ]);

        foreach ($validatedData['traitements'] as $data) {
            $traitement = Traitement::find($data['id']);
            $traitement->update($data);
        }

        return response()->json(['message' => 'Traitements mis à jour avec succès.']);
    }

    public function destroy(Request $request, string $id = null)
    {
        if ($id) {
            $traitement = Traitement::findOrFail($id);
            $traitement->delete();
        } else {
            $validatedData = $request->validate([
                'ids' => 'required|array',
                'ids.*' => 'required|exists:traitements,id',
            ]);

            Traitement::whereIn('id', $validatedData['ids'])->delete();
        }

        return response()->json(['message' => 'Traitements supprimés avec succès.']);
    }
}
