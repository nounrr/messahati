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
            'mutuels.*.nom_mutuel' => 'required|string'
        ]);
    
        $createdItems = [];
        foreach ($validated['mutuels'] as $data) {
            
            $createdItems[] = Mutuel::create($data);
        }
    
        return response()->json($createdItems, 201);
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

    public function update(Request $request)
    {
        $validated = $request->validate([
            'updates' => 'required|array',
            'updates.*.id' => 'required|exists:mutuels,id',
            'updates.*.nom_mutuel' => 'required|string'
        ]);
    
        $updatedItems = [];
        foreach ($validated['updates'] as $data) {
            $item = Mutuel::findOrFail($data['id']);
            
            $item->update($data);
            $updatedItems[] = $item;
        }
    
        return response()->json($updatedItems, 200);
    }
    public function destroy($id)
    {
        Mutuel::findOrFail($id)->delete();
        return redirect()->route('mutuel.index')->with('success', 'Mutuel deleted successfully');
    }
}