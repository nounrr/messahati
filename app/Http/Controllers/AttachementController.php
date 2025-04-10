<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Attachement;

class AttachementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $attachements = Attachement::all();
        return response()->json($attachements);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('attachements.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'nom' => 'required|string|max:255',
            'path' => 'required|string|max:255',
            'type' => 'required|string|max:50',
            'related_id' => 'nullable|integer',
            'related_type' => 'nullable|string|max:255',
        ]);

        Attachement::create($validatedData);

        return redirect()->route('attachements.index')->with('success', 'Attachement créé avec succès.');
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $attachement = Attachement::findOrFail($id);
        return response()->json($attachement);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $attachement = Attachement::findOrFail($id);
        return view('attachements.edit', compact('attachement'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'nom' => 'required|string|max:255',
            'path' => 'required|string|max:255',
            'type' => 'required|string|max:50',
            'related_id' => 'nullable|integer',
            'related_type' => 'nullable|string|max:255',
        ]);

        $attachement = Attachement::findOrFail($id);
        $attachement->update($validatedData);

        return redirect()->route('attachements.index')->with('success', 'Attachement mis à jour avec succès.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $attachement = Attachement::findOrFail($id);
        $attachement->delete();

        return redirect()->route('attachements.index')->with('success', 'Attachement supprimé avec succès.');
    }
}