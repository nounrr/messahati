<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Ordonance;

class OrdonanceController extends Controller
{
    //index
    public function index()
    {
        $ordonances = Ordonance::all();
        return response()->json($ordonances);
    }
//create
    public function create()
    {
        return view('ordonances.create');
    }
//store
    public function store(Request $request)
{
    $validated = $request->validate([
        'ordonances.*.date_emission' => 'required|date',
        'ordonances.*.description' => 'required|string',
        'ordonances.*.traitement_id' => 'required|exists:traitements,id'
    ]);

    $createdItems = [];
    foreach ($validated['ordonances'] as $data) {
        
        $createdItems[] = Ordonance::create($data);
    }

    return response()->json($createdItems, 201);
}


// show 
    public function show(string $id)
    {
        $ordonance = Ordonance::findOrFail($id);
        return response()->json($ordonance);
    }
// edit
    public function edit(string $id)
    {
        $ordonance = Ordonance::findOrFail($id);
        return view('ordonances.edit', compact('ordonance'));
    }
//update 
    public function update(Request $request)
    {
        $validated = $request->validate([
            'updates' => 'required|array',
            'updates.*.id' => 'required|exists:ordonances,id',
            'updates.*.date_emission' => 'required|date',
            'updates.*.description' => 'required|string',
            'updates.*.traitement_id' => 'required|exists:traitements,id'
        ]);
    
        $updatedItems = [];
        foreach ($validated['updates'] as $data) {
            $item = Ordonance::findOrFail($data['id']);
            
            $item->update($data);
            $updatedItems[] = $item;
        }
    
        return response()->json($updatedItems, 200);
    }
//delete
    public function destroy(Request $request, string $id = null)
    {
        if ($id) {
            $ordonance = Ordonance::findOrFail($id);
            $ordonance->delete();
        } else {
            $validatedData = $request->validate([
                'ids' => 'required|array',
                'ids.*' => 'required|exists:ordonances,id',
            ]);

            Ordonance::whereIn('id', $validatedData['ids'])->delete();
        }

        return response()->json(['message' => 'Ordonnances supprimées avec succès.']);
    }
}
