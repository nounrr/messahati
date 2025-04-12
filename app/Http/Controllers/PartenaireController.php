<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Partenaire;

class PartenaireController extends Controller
{
    public function index()
    {
        $partenaires = Partenaire::all();
        return response()->json($partenaires);
    }

    public function create()
    {
        return view('partenaires.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'partenaires.*.clinique_id' => 'required|exists:cliniques,id',
            'partenaires.*.nom' => 'required|string',
            'partenaires.*.adress' => 'required|string',
            'partenaires.*.typepartenaires_id' => 'required|exists:typepartenairess,id',
            'partenaires.*.telephone' => 'required|string'
        ]);
    
        $createdItems = [];
        foreach ($validated['partenaires'] as $data) {
            
            $createdItems[] = Partenaire::create($data);
        }
    
        return response()->json($createdItems, 201);
    }
    
   

    public function show(string $id)
    {
        $partenaire = Partenaire::findOrFail($id);
        return response()->json($partenaire);
    }

    public function edit(string $id)
    {
        $partenaire = Partenaire::findOrFail($id);
        return view('partenaires.edit', compact('partenaire'));
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'updates' => 'required|array',
            'updates.*.id' => 'required|exists:partenaires,id',
            'updates.*.clinique_id' => 'required|exists:cliniques,id',
            'updates.*.nom' => 'required|string',
            'updates.*.adress' => 'required|string',
            'updates.*.typepartenaires_id' => 'required|exists:typepartenairess,id',
            'updates.*.telephone' => 'required|string'
        ]);
    
        $updatedItems = [];
        foreach ($validated['updates'] as $data) {
            $item = Partenaire::findOrFail($data['id']);
            
            $item->update($data);
            $updatedItems[] = $item;
        }
    
        return response()->json($updatedItems, 200);
    }
    public function destroy(Request $request, string $id = null)
    {
        if ($id) {
            $partenaire = Partenaire::findOrFail($id);
            $partenaire->delete();
        } else {
            $validatedData = $request->validate([
                'ids' => 'required|array',
                'ids.*' => 'required|exists:partenaires,id',
            ]);

            Partenaire::whereIn('id', $validatedData['ids'])->delete();
        }

        return response()->json(['message' => 'Partenaires supprimés avec succès.']);
    }
}
