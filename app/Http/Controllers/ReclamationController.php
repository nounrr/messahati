<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Reclamation;
use Illuminate\Support\Facades\Auth;
class ReclamationController extends Controller
{
   
    public function index()
    {
        $reclamations = Reclamation::with('user')->get(); // Récupère toutes les réclamations avec les utilisateurs associés
        return view('reclamation.index', compact('reclamations'));
    }
    
        public function create()
        {
            return view('reclamation.create');
        }
    
        public function store(Request $request)
        {
            $validated = $request->validate([
                'titre' => 'required|string',
                'description' => 'required|string',
                'statut' => 'required|string|in:en_attente,traité,rejeté',
                'date_reclamation' => 'required|date',
            ]);
            foreach ($validated['reclamation'] as $data){
                Reclamation::create($validated);
            } 
            return redirect()->route('reclamation.index')->with('success', 'Reclamation created successfully');
        }
    
        public function show($id)
        {
            $reclamation = Reclamation::with('user')->findOrFail($id); // Récupère une réclamation spécifique avec l'utilisateur associé
            return view('reclamation.show', compact('reclamation'));
        }
    
        public function edit($id)
        {
            $reclamation = Reclamation::findOrFail($id);
            return view('reclamation.edit', compact('reclamation'));
        }
    
        public function update(Request $request, $id)
        {
            $reclamation = Reclamation::findOrFail($id);
            $validated = $request->validate([
                'titre' => 'required|string',
                'description' => 'required|string',
                'statut' => 'required|string|in:en_attente,traité,rejeté',
                'date_reclamation' => 'required|date',
            ]);
            foreach ($validated['reclamation'] as $data){
                $reclamation->update($validated);
            } 
            return redirect()->route('reclamation.index')->with('success', 'Reclamation updated successfully');
        }
    
        public function destroy($id)
        {
            Reclamation::findOrFail($id)->delete();
            return redirect()->route('reclamation.index')->with('success', 'Reclamation deleted successfully');
        }
    
    
}
