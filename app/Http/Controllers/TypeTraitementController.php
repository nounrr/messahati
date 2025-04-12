<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TypeTraitement;
use Illuminate\Support\Facades\Storage;

class TypeTraitementController extends Controller
{
    public function index()
    {
        $types = TypeTraitement::all();
        return response()->json($types);
    }

    public function create()
    {
        return view('type-traitements.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'typetraitements.*.nom' => 'required|string'
        ]);
    
        $createdItems = [];
        foreach ($validated['typetraitements'] as $data) {
            
            $createdItems[] = TypeTraitement::create($data);
        }
    
        return response()->json($createdItems, 201);
    }
    
   
    public function edit(string $id)
    {
        $type = TypeTraitement::findOrFail($id);
        return view('type-traitements.edit', compact('type'));
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'updates' => 'required|array',
            'updates.*.id' => 'required|exists:typetraitements,id',
            'updates.*.nom' => 'required|string'
        ]);
    
        $updatedItems = [];
        foreach ($validated['updates'] as $data) {
            $item = TypeTraitement::findOrFail($data['id']);
            
            $item->update($data);
            $updatedItems[] = $item;
        }
    
        return response()->json($updatedItems, 200);
    }

    public function destroy(Request $request, string $id = null)
    {
        if ($id) {
            $type = TypeTraitement::findOrFail($id);
            $type->delete();
        } else {
            $validatedData = $request->validate([
                'ids' => 'required|array',
                'ids.*' => 'required|exists:type_traitements,id',
            ]);

            TypeTraitement::whereIn('id', $validatedData['ids'])->delete();
        }

        return response()->json(['message' => 'Types de traitements supprimés avec succès.']);
    }
}
