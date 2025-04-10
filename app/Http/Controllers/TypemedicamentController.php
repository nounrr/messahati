<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TypeMedicament;

class TypemedicamentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $types = TypeMedicament::all();
        return response()->json($types);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('typemedicaments.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'nom' => 'required|string|max:255',
        ]);

        TypeMedicament::create($validatedData);

        return redirect()->route('typemedicaments.index')->with('success', 'Type de médicament créé avec succès.');
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $type = TypeMedicament::findOrFail($id);
        return response()->json($type);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $type = TypeMedicament::findOrFail($id);
        return view('typemedicaments.edit', compact('type'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'nom' => 'required|string|max:255',
        ]);

        $type = TypeMedicament::findOrFail($id);
        $type->update($validatedData);

        return redirect()->route('typemedicaments.index')->with('success', 'Type de médicament mis à jour avec succès.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $type = TypeMedicament::findOrFail($id);
        $type->delete();

        return redirect()->route('typemedicaments.index')->with('success', 'Type de médicament supprimé avec succès.');
    }
}
