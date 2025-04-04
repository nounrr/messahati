<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Partenaire;

class PartenaireController extends Controller
{
    public function index()
    {
        $partenaires = Partenaire::all();
        return response()->json($partenaires);
    }

    public function create()
    {
        return view('partenaires.create');
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'partenaires' => 'required|array',
            'partenaires.*.nom' => 'required|string|max:255',
            'partenaires.*.description' => 'nullable|string',
        ]);

        foreach ($validatedData['partenaires'] as $data) {
            Partenaire::create($data);
        }

        return response()->json(['message' => 'Partenaires créés avec succès.']);
    }

    public function show(string $id)
    {
        $partenaire = Partenaire::findOrFail($id);
        return response()->json($partenaire);
    }

    public function edit(string $id)
    {
        $partenaire = Partenaire::findOrFail($id);
        return view('partenaires.edit', compact('partenaire'));
    }

    public function update(Request $request, string $id = null)
    {
        $validatedData = $request->validate([
            'partenaires' => 'required|array',
            'partenaires.*.id' => 'required|exists:partenaires,id',
            'partenaires.*.nom' => 'required|string|max:255',
            'partenaires.*.description' => 'nullable|string',
        ]);

        foreach ($validatedData['partenaires'] as $data) {
            $partenaire = Partenaire::find($data['id']);
            $partenaire->update($data);
        }

        return response()->json(['message' => 'Partenaires mis à jour avec succès.']);
    }

    public function destroy(Request $request, string $id = null)
    {
        if ($id) {
            $partenaire = Partenaire::findOrFail($id);
            $partenaire->delete();
        } else {
            $validatedData = $request->validate([
                'ids' => 'required|array',
                'ids.*' => 'required|exists:partenaires,id',
            ]);

            Partenaire::whereIn('id', $validatedData['ids'])->delete();
        }

        return response()->json(['message' => 'Partenaires supprimés avec succès.']);
    }
}
