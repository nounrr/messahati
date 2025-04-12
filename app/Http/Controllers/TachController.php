<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Tache;

class TachController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $taches = Tache::all();
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
    $validated = $request->validate([
        'taches.*.title' => 'required|string',
        'taches.*.user_id' => 'required|exists:users,id',
        'taches.*.description' => 'required|string',
        'taches.*.status' => 'required',
        'taches.*.priority' => 'required|string',
        'taches.*.date_debut' => 'required|date',
        'taches.*.date_fin' => 'required|date'
    ]);

    $createdItems = [];
    foreach ($validated['taches'] as $data) {
        
        $createdItems[] = Tache::create($data);
    }

    return response()->json($createdItems, 201);
}


    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $tach = Tache::findOrFail($id);
        return response()->json($tach);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $tach = Tache::findOrFail($id);
        return view('taches.edit', compact('tach'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
{
    $validated = $request->validate([
        'updates' => 'required|array',
        'updates.*.id' => 'required|exists:taches,id',
        'updates.*.title' => 'required|string',
        'updates.*.user_id' => 'required|exists:users,id',
        'updates.*.description' => 'required|string',
        'updates.*.status' => 'required',
        'updates.*.priority' => 'required|string',
        'updates.*.date_debut' => 'required|date',
        'updates.*.date_fin' => 'required|date'
    ]);

    $updatedItems = [];
    foreach ($validated['updates'] as $data) {
        $item = Tache::findOrFail($data['id']);
        
        $item->update($data);
        $updatedItems[] = $item;
    }

    return response()->json($updatedItems, 200);
}

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $tach = Tache::findOrFail($id);
        $tach->delete();

        return redirect()->route('taches.index')->with('success', 'Tâche supprimée avec succès.');
    }
}
