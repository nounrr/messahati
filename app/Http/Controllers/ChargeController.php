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
        $validatedData = $request->validate([
            'nom' => 'required|string|max:255',
            'prix_unitaire' => 'required|numeric',
            'quantite' => 'required|integer',
            'partenaire_id' => 'required|exists:partenaires,id',
        ]);

        Charge::create($validatedData);

        return redirect()->route('charges.index')->with('success', 'Charge created successfully.');
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
    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'nom' => 'required|string|max:255',
            'prix_unitaire' => 'required|numeric',
            'quantite' => 'required|integer',
            'partenaire_id' => 'required|exists:partenaires,id',
        ]);

        $charge = Charge::findOrFail($id);
        $charge->update($validatedData);

        return redirect()->route('charges.index')->with('success', 'Charge updated successfully.');
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
