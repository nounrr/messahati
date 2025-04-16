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
        $validated = $request->validate([
            'attachements.*.filename' => 'required|string',
            'attachements.*.taches_id' => 'required|exists:tachess,id'
        ]);
    
        $createdItems = [];
        foreach ($validated['attachements'] as $data) {
            
            $createdItems[] = Attachement::create($data);
        }
    
        return response()->json($createdItems, 201);
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
    public function update(Request $request)
    {
        $validated = $request->validate([
            'updates' => 'required|array',
            'updates.*.id' => 'required|exists:attachements,id',
            'updates.*.filename' => 'required|string',
            'updates.*.taches_id' => 'required|exists:tachess,id'
        ]);
    
        $updatedItems = [];
        foreach ($validated['updates'] as $data) {
            $item = Attachement::findOrFail($data['id']);
            
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
        $attachement = Attachement::findOrFail($id);
        $attachement->delete();

        return redirect()->route('attachements.index')->with('success', 'Attachement supprimé avec succès.');
    }
}