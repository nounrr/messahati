<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\RendezVous;

class RendezVousController extends Controller
{
    public function index()
    {
        $rendezVous = RendezVous::all();
        return response()->json($rendezVous);
    }

    public function create()
    {
        return view('rendezvous.create');
    }

    public function store(Request $request)
{
    $validated = $request->validate([
        'rendez_vous.*.patient_id' => 'required|exists:patients,id',
        'rendez_vous.*.docteur_id' => 'required|exists:docteurs,id',
        'rendez_vous.*.departement_id' => 'required|exists:departements,id',
        'rendez_vous.*.patient_id' => 'required|exists:patients,id',
        'rendez_vous.*.docteur_id' => 'required|exists:docteurs,id',
        'rendez_vous.*.date_heure' => 'required',
        'rendez_vous.*.departement_id' => 'required|exists:departements,id',
        'rendez_vous.*.traitement_id' => 'required|exists:traitements,id',
        'rendez_vous.*.statut' => 'required'
    ]);

    $createdItems = [];
    foreach ($validated['rendez_vous'] as $data) {
        
        $createdItems[] = Rendezvous::create($data);
    }

    return response()->json($createdItems, 201);
}



    public function show(string $id)
    {
        $rendezVous = RendezVous::findOrFail($id);
        return response()->json($rendezVous);
    }

    public function edit(string $id)
    {
        $rendezVous = RendezVous::findOrFail($id);
        return view('rendezvous.edit', compact('rendezVous'));
    }

    public function update(Request $request)
{
    $validated = $request->validate([
        'updates' => 'required|array',
        'updates.*.id' => 'required|exists:rendez_vous,id',
        'updates.*.patient_id' => 'required|exists:patients,id',
        'updates.*.docteur_id' => 'required|exists:docteurs,id',
        'updates.*.departement_id' => 'required|exists:departements,id',
        'updates.*.patient_id' => 'required|exists:patients,id',
        'updates.*.docteur_id' => 'required|exists:docteurs,id',
        'updates.*.date_heure' => 'required',
        'updates.*.departement_id' => 'required|exists:departements,id',
        'updates.*.traitement_id' => 'required|exists:traitements,id',
        'updates.*.statut' => 'required'
    ]);

    $updatedItems = [];
    foreach ($validated['updates'] as $data) {
        $item = Rendezvous::findOrFail($data['id']);
        
        $item->update($data);
        $updatedItems[] = $item;
    }

    return response()->json($updatedItems, 200);
}

    public function destroy(Request $request, string $id = null)
    {
        if ($id) {
            $rendezVous = RendezVous::findOrFail($id);
            $rendezVous->delete();
        } else {
            $validatedData = $request->validate([
                'ids' => 'required|array',
                'ids.*' => 'required|exists:rendez_vous,id',
            ]);

            RendezVous::whereIn('id', $validatedData['ids'])->delete();
        }

        return response()->json(['message' => 'Rendez-vous supprimés avec succès.']);
    }
}
