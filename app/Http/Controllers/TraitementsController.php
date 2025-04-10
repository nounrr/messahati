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
            'nom' => 'required|string|max:255',
            'description' => 'nullable|string',
            'prix' => 'required|numeric',
            'type_traitement_id' => 'required|exists:type_traitements,id',
        ]);

        Traitement::create($validatedData);

        return redirect()->route('traitements.index')->with('success', 'Traitement créé avec succès.');
    }

    public function show($id)
    {
        $traitement = Traitement::findOrFail($id);
        return response()->json($traitement);
    }

    public function edit($id)
    {
        $traitement = Traitement::findOrFail($id);
        return view('traitements.edit', compact('traitement'));
    }

    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'nom' => 'required|string|max:255',
            'description' => 'nullable|string',
            'prix' => 'required|numeric',
            'type_traitement_id' => 'required|exists:type_traitements,id',
        ]);

        $traitement = Traitement::findOrFail($id);
        $traitement->update($validatedData);

        return redirect()->route('traitements.index')->with('success', 'Traitement mis à jour avec succès.');
    }

    public function destroy($id)
    {
        $traitement = Traitement::findOrFail($id);
        $traitement->delete();

        return redirect()->route('traitements.index')->with('success', 'Traitement supprimé avec succès.');
    }
}