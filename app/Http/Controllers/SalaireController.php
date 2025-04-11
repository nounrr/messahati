<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Salaire;

class SalaireController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $salaires = Salaire::all();
        return response()->json($salaires);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('salaires.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'montant' => 'required|numeric',
            'primes' => 'nullable|numeric',
            'date' => 'required|date',
            'user_id' => 'required|exists:users,id',
        ]);

        Salaire::create($validatedData);

        return redirect()->route('salaires.index')->with('success', 'Salaire créé avec succès.');
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $salaire = Salaire::findOrFail($id);
        return response()->json($salaire);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $salaire = Salaire::findOrFail($id);
        return view('salaires.edit', compact('salaire'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'montant' => 'required|numeric',
            'primes' => 'nullable|numeric',
            'date' => 'required|date',
            'user_id' => 'required|exists:users,id',
        ]);

        $salaire = Salaire::findOrFail($id);
        $salaire->update($validatedData);

        return redirect()->route('salaires.index')->with('success', 'Salaire mis à jour avec succès.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $salaire = Salaire::findOrFail($id);
        $salaire->delete();

        return redirect()->route('salaires.index')->with('success', 'Salaire supprimé avec succès.');
    }
}
