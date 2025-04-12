<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Traitement;

class TraitementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $traitements = Traitement::all();
        return response()->json($traitements);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Si tu utilises Vue/React/API : cette méthode peut rester vide ou être ignorée.
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'traitements.*.typetraitement_id' => 'required|exists:typetraitements,id',
            'traitements.*.description' => 'required|string',
            'traitements.*.date_debut' => 'required|date',
            'traitements.*.date_fin' => 'required|date',
        ]);

        $created = [];
        foreach ($validated['traitements'] as $data) {
            $created[] = Traitement::create($data);
        }

        return response()->json($created, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $traitement = Traitement::findOrFail($id);
        return response()->json($traitement);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        // Comme create(), si tu travailles avec des APIs frontend, cette méthode peut rester vide.
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Traitement $traitement)
    {
        $validated = $request->validate([
            'typetraitement_id' => 'required|exists:typetraitements,id',
            'description' => 'required|string',
            'date_debut' => 'required|date',
            'date_fin' => 'required|date',
        ]);

        $traitement->update($validated);

        return response()->json($traitement, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $traitement = Traitement::findOrFail($id);
        $traitement->delete();

        return response()->json(['message' => 'Traitement supprimé avec succès.']);
    }
}
