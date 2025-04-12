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
    // STORE
public function store(Request $request)
{
    $validated = $request->validate([
        'salaires.*.montant' => 'required|numeric',
        'salaires.*.primes' => 'required|numeric',
        'salaires.*.date' => 'required|date',
        'salaires.*.user_id' => 'required|exists:users,id',
    ]);

    $created = [];
    foreach ($validated['salaires'] as $data) {
        $created[] = Salaire::create($data);
    }

    return response()->json($created, 201);
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
    // UPDATE
public function update(Request $request)
{
    $validated = $request->validate([
        'salaires.*.id' => 'required|exists:salaires,id',
        'salaires.*.montant' => 'required|numeric',
        'salaires.*.primes' => 'required|numeric',
        'salaires.*.date' => 'required|date',
        'salaires.*.user_id' => 'required|exists:users,id',
    ]);

    $updated = [];
    foreach ($validated['salaires'] as $data) {
        $salaire = Salaire::findOrFail($data['id']);
        $salaire->update($data);
        $updated[] = $salaire;
    }

    return response()->json($updated, 200);
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
