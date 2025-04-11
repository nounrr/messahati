<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Tach;

class TachController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $taches = Tach::all();
        return response()->json($taches);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('taches.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'nom' => 'required|string|max:255',
            'description' => 'nullable|string',
            'date_debut' => 'required|date',
            'date_fin' => 'required|date|after_or_equal:date_debut',
            'user_id' => 'required|exists:users,id',
        ]);

        Tach::create($validatedData);

        return redirect()->route('taches.index')->with('success', 'Tâche créée avec succès.');
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $tach = Tach::findOrFail($id);
        return response()->json($tach);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $tach = Tach::findOrFail($id);
        return view('taches.edit', compact('tach'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'nom' => 'required|string|max:255',
            'description' => 'nullable|string',
            'date_debut' => 'required|date',
            'date_fin' => 'required|date|after_or_equal:date_debut',
            'user_id' => 'required|exists:users,id',
        ]);

        $tach = Tach::findOrFail($id);
        $tach->update($validatedData);

        return redirect()->route('taches.index')->with('success', 'Tâche mise à jour avec succès.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $tach = Tach::findOrFail($id);
        $tach->delete();

        return redirect()->route('taches.index')->with('success', 'Tâche supprimée avec succès.');
    }
}
