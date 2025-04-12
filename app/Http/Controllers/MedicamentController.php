<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Medicament;

class MedicamentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $medicaments = Medicament::all();
        return response()->json($medicaments);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('medicaments.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
{
    $validated = $request->validate([
        'medicaments.*.nom' => 'required|string',
        'medicaments.*.prix' => 'required|numeric',
        'medicaments.*.description' => 'nullable|string',
        'medicaments.*.typemedicaments_id' => 'required|exists:typemedicaments,id',
        'medicaments.*.image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
    ]);

    $created = [];
    foreach ($validated['medicaments'] as $data) {
        if (isset($data['image'])) {
            $filename = time() . '_' . $data['image']->getClientOriginalName();
            $data['image']->storeAs('public/images', $filename);
            $data['image'] = $filename;
        }

        $created[] = Medicament::create($data);
    }

    return response()->json($created, 201);
}


    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $medicament = Medicament::findOrFail($id);
        return response()->json($medicament);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $medicament = Medicament::findOrFail($id);
        return view('medicaments.edit', compact('medicament'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
{
    $validated = $request->validate([
        'medicaments.*.id' => 'required|exists:medicaments,id',
        'medicaments.*.nom' => 'required|string',
        'medicaments.*.prix' => 'required|numeric',
        'medicaments.*.description' => 'nullable|string',
        'medicaments.*.typemedicaments_id' => 'required|exists:typemedicaments,id',
        'medicaments.*.image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
    ]);

    $updated = [];
    foreach ($validated['medicaments'] as $data) {
        $medicament = Medicament::find($data['id']);

        if (isset($data['image'])) {
            $filename = time() . '_' . $data['image']->getClientOriginalName();
            $data['image']->storeAs('public/images', $filename);
            $data['image'] = $filename;
        } else {
            unset($data['image']); // Don't override if not provided
        }

        $medicament->update($data);
        $updated[] = $medicament;
    }

    return response()->json($updated, 200);
}


    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $medicament = Medicament::findOrFail($id);
        $medicament->delete();

        return redirect()->route('medicaments.index')->with('success', 'Médicament supprimé avec succès.');
    }
}
