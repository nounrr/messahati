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
            'nom' => 'required|string|max:255',
            'adresse' => 'required|string|max:255',
            'telephone' => 'required|string|max:15',
        ]);

        Clinique::create($validatedData);

        return redirect()->route('cliniques.index')->with('success', 'Clinique créée avec succès.');
    }

    public function show($id)
    {
        $clinique = Clinique::findOrFail($id);
        return response()->json($clinique);
    }

    public function edit($id)
    {
        $clinique = Clinique::findOrFail($id);
        return view('cliniques.edit', compact('clinique'));
    }

    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'nom' => 'required|string|max:255',
            'adresse' => 'required|string|max:255',
            'telephone' => 'required|string|max:15',
        ]);

        $clinique = Clinique::findOrFail($id);
        $clinique->update($validatedData);

        return redirect()->route('cliniques.index')->with('success', 'Clinique mise à jour avec succès.');
    }

    public function destroy($id)
    {
        $clinique = Clinique::findOrFail($id);
        $clinique->delete();

        return redirect()->route('cliniques.index')->with('success', 'Clinique supprimée avec succès.');
    }
}

