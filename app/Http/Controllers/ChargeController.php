<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Charge;

class ChargeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $charges = Charge::all();
        return response()->json($charges);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('charges.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'charges.*.nom' => 'required|string',
            'charges.*.prix_unitaire' => 'required|numeric',
            'charges.*.quantite' => 'required|numeric',
            'charges.*.partenaire_id' => 'required|exists:partenaires,id'
        ]);
    
        $createdItems = [];
        foreach ($validated['charges'] as $data) {
            
            $createdItems[] = Charge::create($data);
        }
    
        return response()->json($createdItems, 201);
    }
    
    
    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $charge = Charge::findOrFail($id);
        return response()->json($charge);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $charge = Charge::findOrFail($id);
        return view('charges.edit', compact('charge'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'updates' => 'required|array',
            'updates.*.id' => 'required|exists:charges,id',
            'updates.*.nom' => 'required|string',
            'updates.*.prix_unitaire' => 'required|numeric',
            'updates.*.quantite' => 'required|numeric',
            'updates.*.partenaire_id' => 'required|exists:partenaires,id'
        ]);
    
        $updatedItems = [];
        foreach ($validated['updates'] as $data) {
            $item = Charge::findOrFail($data['id']);
            
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
        $charge = Charge::findOrFail($id);
        $charge->delete();

        return redirect()->route('charges.index')->with('success', 'Charge deleted successfully.');
    }
}
