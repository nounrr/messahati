<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Clinique;

class CliniqueController extends Controller
{
    public function index()
    {
        $cliniques = Clinique::all();
        return response()->json($cliniques);
    }

    public function create()
    {
        return view('cliniques.create');
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'cliniques' => 'required|array',
            'cliniques.*.nom' => 'required|string|max:255',
            'cliniques.*.adresse' => 'required|string|max:255',
            'cliniques.*.email' => 'required|email',
            'cliniques.*.site_web' => 'nullable|url',
            'cliniques.*.description' => 'nullable|string',
        ]);

        foreach ($validatedData['cliniques'] as $data) {
            Clinique::create($data);
        }

        return response()->json(['message' => 'Cliniques créées avec succès.']);
    }

    public function show(string $id)
    {
        $clinique = Clinique::findOrFail($id);
        return response()->json($clinique);
    }

    public function edit(string $id)
    {
        $clinique = Clinique::findOrFail($id);
        return view('cliniques.edit', compact('clinique'));
    }

    public function update(Request $request, string $id = null)
    {
        $validatedData = $request->validate([
            'cliniques' => 'required|array',
            'cliniques.*.id' => 'required|exists:cliniques,id',
            'cliniques.*.nom' => 'required|string|max:255',
            'cliniques.*.adresse' => 'required|string|max:255',
            'cliniques.*.email' => 'required|email',
            'cliniques.*.site_web' => 'nullable|url',
            'cliniques.*.description' => 'nullable|string',
        ]);

        foreach ($validatedData['cliniques'] as $data) {
            $clinique = Clinique::find($data['id']);
            $clinique->update($data);
        }

        return response()->json(['message' => 'Cliniques mises à jour avec succès.']);
    }

    public function destroy(Request $request, string $id = null)
    {
        if ($id) {
            $clinique = Clinique::findOrFail($id);
            $clinique->delete();
        } else {
            $validatedData = $request->validate([
                'ids' => 'required|array',
                'ids.*' => 'required|exists:cliniques,id',
            ]);

            Clinique::whereIn('id', $validatedData['ids'])->delete();
        }

        return response()->json(['message' => 'Cliniques supprimées avec succès.']);
    }
}
