<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Salaire;

class SalaireController extends Controller
{
    // Liste des salaires
    public function index()
    {
        $salaires = Salaire::all();
        return response()->json($salaires);
    }

    // Formulaire de création
    public function create()
    {
        return view('salaires.create');
    }

    // Enregistrement de plusieurs salaires
    public function store(Request $request)
    {
        $validated = $request->validate([
            'salaires' => 'required|array',
            'salaires.*.montant' => 'required|numeric',
            'salaires.*.primes' => 'required|numeric',
            'salaires.*.date' => 'required|date',
            'salaires.*.user_id' => 'required|exists:users,id',
        ]);

        $created = [];

        foreach ($validated['salaires'] as $data) {
            $salaire = new Salaire();
            $salaire->montant = $data['montant'];
            $salaire->primes = $data['primes'];
            $salaire->date = $data['date'];
            $salaire->user_id = $data['user_id'];
            $salaire->save();

            $created[] = $salaire;
        }

        return response()->json($created, 201);
    }

    // Affiche un salaire
    public function show($id)
    {
        $salaire = Salaire::findOrFail($id);
        return response()->json($salaire);
    }

    // Formulaire d’édition
    public function edit($id)
    {
        $salaire = Salaire::findOrFail($id);
        return view('salaires.edit', compact('salaire'));
    }

    // Mise à jour de plusieurs salaires
    public function update(Request $request)
    {
        $validated = $request->validate([
            'salaires' => 'required|array',
            'salaires.*.id' => 'required|exists:salaires,id',
            'salaires.*.montant' => 'required|numeric',
            'salaires.*.primes' => 'required|numeric',
            'salaires.*.date' => 'required|date',
            'salaires.*.user_id' => 'required|exists:users,id',
        ]);

        $updated = [];

        foreach ($validated['salaires'] as $data) {
            $salaire = Salaire::findOrFail($data['id']);
            $salaire->montant = $data['montant'];
            $salaire->primes = $data['primes'];
            $salaire->date = $data['date'];
            $salaire->user_id = $data['user_id'];
            $salaire->save();

            $updated[] = $salaire;
        }

        return response()->json($updated, 200);
    }

    // Suppression d’un salaire
    public function destroy($id)
    {
        $salaire = Salaire::findOrFail($id);
        $salaire->delete();

        return redirect()->route('salaires.index')->with('success', 'Salaire supprimé avec succès.');
    }
}
