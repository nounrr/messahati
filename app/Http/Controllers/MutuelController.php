<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Mutuel;
use App\Models\Type;
use Illuminate\Support\Facades\Auth;

class MutuelController extends Controller
{
    public function index()
{
    $mutuels = Mutuel::with('user')->get(); // Récupère toutes les mutuelles avec les utilisateurs associés
    return view('mutuel.index', compact('mutuels'));
}
    public function create()
    {
        return view('mutuel.create');
    }

    public function store(Request $request)
{
    $validated = $request->validate([
        'mutuels.*.nom_mutuel' => 'required|string',
        'mutuels.*.code_mutuel' => 'required|string|unique:mutuels,code_mutuel',
        'mutuels.*.description' => 'nullable|string',
        'mutuels.*.date_creation' => 'required|date',
        'mutuels.*.taux_remboursement' => 'required|numeric',
    ]);

    // Boucle sur chaque mutuel et crée une nouvelle entrée
    $createdMutuels = [];
    foreach ($validated['mutuels'] as $data) {
        $createdMutuels[] = Mutuel::create($data);
    }

    return response()->json([
        'message' => count($createdMutuels) . ' Mutuels created successfully.',
        'mutuels' => $createdMutuels
    ], 201);
}


    public function show($id)
    {
        $mutuel = Mutuel::with('user')->findOrFail($id); // Récupère une mutuelle spécifique avec l'utilisateur associé
        return view('mutuel.show', compact('mutuel'));
    }

    public function edit($id)
    {
        $mutuel = Mutuel::findOrFail($id);
        return view('mutuel.edit', compact('mutuel'));
    }

    public function update(Request $request, $id)
    {
        $mutuel = Mutuel::findOrFail($id);
        $validated = $request->validate([
            'nom_mutuel' => 'required|string',
            'code_mutuel' => 'required|string|unique:mutuels,code_mutuel,' . $id,
            'description' => 'nullable|string',
            'date_creation' => 'required|date',
            'taux_remboursement' => 'required|numeric',
        ]);
      
            $mutuel->update($validated);
        
        return redirect()->route('mutuel.index')->with('success', 'Mutuel updated successfully');
    }

    public function destroy($id)
    {
        Mutuel::findOrFail($id)->delete();
        return redirect()->route('mutuel.index')->with('success', 'Mutuel deleted successfully');
    }
}