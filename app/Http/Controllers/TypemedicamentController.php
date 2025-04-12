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
    // STORE
public function store(Request $request)
{
    $validated = $request->validate([
        'typemedicaments.*.nom' => 'required|string',
    ]);

    $created = [];
    foreach ($validated['typemedicaments'] as $data) {
        $created[] = TypeMedicament::create($data);
    }

    return response()->json($created, 201);
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
    public function update(Request $request)
{
    $validated = $request->validate([
        'typemedicaments.*.id' => 'required|exists:typemedicaments,id',
        'typemedicaments.*.nom' => 'required|string',
    ]);

    $updated = [];
    foreach ($validated['typemedicaments'] as $data) {
        $model = TypeMedicament::findOrFail($data['id']);
        $model->update($data);
        $updated[] = $model;
    }

    return response()->json($updated, 200);
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
