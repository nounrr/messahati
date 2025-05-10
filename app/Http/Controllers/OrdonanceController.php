<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Ordonance;

class OrdonanceController extends Controller
{
    // Affiche la liste des ordonnances
    public function index()
    {
        $ordonances = Ordonance::with([
            'traitement',
            'traitement.patient',
            'traitement.medecin',
            'medicaments'
        ])->get()->map(function ($ordonance) {
            return [
                'id' => $ordonance->id,
                'date_emission' => $ordonance->created_at,
                'date_expiration' => $ordonance->date_expiration,
                'description' => $ordonance->description,
                'patient' => [
                    'id' => $ordonance->traitement->patient->id,
                    'name' => $ordonance->traitement->patient->name,
                ],
                'docteur' => [
                    'id' => $ordonance->traitement->medecin->id,
                    'name' => $ordonance->traitement->medecin->name,
                    'specialite' => $ordonance->traitement->medecin->specialite ?? 'Médecin',
                ],
                'medicaments' => $ordonance->medicaments->map(function ($medicament) {
                    return [
                        'id' => $medicament->id,
                        'nom' => $medicament->nom,
                        'posologie' => $medicament->pivot->posologie,
                    ];
                }),
            ];
        });

        return response()->json($ordonances);
    }

    // Affiche le formulaire de création
    public function create()
    {
        return view('ordonances.create');
    }

    // Enregistre plusieurs ordonnances (instanciation manuelle)
    public function store(Request $request)
    {
        $ordonance = Ordonance::create($request->all());
        if ($request->has('medicaments')) {
            $ordonance->medicaments()->attach($request->medicaments);
        }
        return response()->json($ordonance->load(['traitement.patient', 'traitement.medecin', 'medicaments']));
    }

    // Affiche une ordonnance spécifique
    public function show(string $id)
    {
        $ordonance = Ordonance::findOrFail($id);
        return response()->json($ordonance);
    }

    // Affiche le formulaire d'édition
    public function edit(string $id)
    {
        $ordonance = Ordonance::findOrFail($id);
        return view('ordonances.edit', compact('ordonance'));
    }

    // Met à jour plusieurs ordonnances (instanciation + affectation directe)
    public function update(Request $request, $id)
    {
        $ordonance = Ordonance::findOrFail($id);
        $ordonance->update($request->all());
        
        if ($request->has('medicaments')) {
            $ordonance->medicaments()->sync($request->medicaments);
        }
        
        return response()->json($ordonance->load(['traitement.patient', 'traitement.medecin', 'medicaments']));
    }

    // Supprime une ou plusieurs ordonnances
    public function destroy($id)
    {
        $ordonance = Ordonance::findOrFail($id);
        $ordonance->medicaments()->detach();
        $ordonance->delete();
        return response()->json(['message' => 'Ordonnance supprimée avec succès']);
    }
}
