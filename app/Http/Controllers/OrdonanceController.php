<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Ordonance;

class OrdonanceController extends Controller
{
    public function index()
    {
        $ordonances = Ordonance::all();
        return response()->json($ordonances);
    }

    public function create()
    {
        return view('ordonances.create');
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'ordonances' => 'required|array',
            'ordonances.*.nom' => 'required|string|max:255',
            'ordonances.*.description' => 'nullable|string',
        ]);

        foreach ($validatedData['ordonances'] as $data) {
            Ordonance::create($data);
        }

        return response()->json(['message' => 'Ordonnances créées avec succès.']);
    }

    public function show(string $id)
    {
        $ordonance = Ordonance::findOrFail($id);
        return response()->json($ordonance);
    }

    public function edit(string $id)
    {
        $ordonance = Ordonance::findOrFail($id);
        return view('ordonances.edit', compact('ordonance'));
    }

    public function update(Request $request, string $id = null)
    {
        $validatedData = $request->validate([
            'ordonances' => 'required|array',
            'ordonances.*.id' => 'required|exists:ordonances,id',
            'ordonances.*.nom' => 'required|string|max:255',
            'ordonances.*.description' => 'nullable|string',
        ]);

        foreach ($validatedData['ordonances'] as $data) {
            $ordonance = Ordonance::find($data['id']);
            $ordonance->update($data);
        }

        return response()->json(['message' => 'Ordonnances mises à jour avec succès.']);
    }

    public function destroy(Request $request, string $id = null)
    {
        if ($id) {
            $ordonance = Ordonance::findOrFail($id);
            $ordonance->delete();
        } else {
            $validatedData = $request->validate([
                'ids' => 'required|array',
                'ids.*' => 'required|exists:ordonances,id',
            ]);

            Ordonance::whereIn('id', $validatedData['ids'])->delete();
        }

        return response()->json(['message' => 'Ordonnances supprimées avec succès.']);
    }
}
