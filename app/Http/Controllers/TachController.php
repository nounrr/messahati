<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Tache;

class TachController extends Controller
{
    // Liste des tâches
    public function index()
    {
        $taches = Tache::all();
        return response()->json($taches);
    }

    // Formulaire de création
    public function create()
    {
        return view('taches.create');
    }

    // Enregistrement de plusieurs tâches (sans create())
    public function store(Request $request)
    {
        $validated = $request->validate([
            'taches' => 'required|array',
            'taches.*.title' => 'required|string',
            'taches.*.user_id' => 'required|exists:users,id',
            'taches.*.description' => 'required|string',
            'taches.*.status' => 'required',
            'taches.*.priority' => 'required|string',
            'taches.*.date_debut' => 'required|date',
            'taches.*.date_fin' => 'required|date'
        ]);

        $createdItems = [];

        foreach ($validated['taches'] as $data) {
            $tache = new Tache();
            $tache->title = $data['title'];
            $tache->user_id = $data['user_id'];
            $tache->description = $data['description'];
            $tache->status = $data['status'];
            $tache->priority = $data['priority'];
            $tache->date_debut = $data['date_debut'];
            $tache->date_fin = $data['date_fin'];
            $tache->save();

            $createdItems[] = $tache;
        }

        return response()->json($createdItems, 201);
    }

    // Affiche une tâche spécifique
    public function show($id)
    {
        $tache = Tache::findOrFail($id);
        return response()->json($tache);
    }

    // Formulaire d'édition
    public function edit($id)
    {
        $tache = Tache::findOrFail($id);
        return view('taches.edit', compact('tache'));
    }

    // Mise à jour de plusieurs tâches (sans update($data))
    public function update(Request $request)
    {
        $validated = $request->validate([
            'updates' => 'required|array',
            'updates.*.id' => 'required|exists:taches,id',
            'updates.*.title' => 'required|string',
            'updates.*.user_id' => 'required|exists:users,id',
            'updates.*.description' => 'required|string',
            'updates.*.status' => 'required',
            'updates.*.priority' => 'required|string',
            'updates.*.date_debut' => 'required|date',
            'updates.*.date_fin' => 'required|date'
        ]);

        $updatedItems = [];

        foreach ($validated['updates'] as $data) {
            $tache = Tache::findOrFail($data['id']);
            $tache->title = $data['title'];
            $tache->user_id = $data['user_id'];
            $tache->description = $data['description'];
            $tache->status = $data['status'];
            $tache->priority = $data['priority'];
            $tache->date_debut = $data['date_debut'];
            $tache->date_fin = $data['date_fin'];
            $tache->save();

            $updatedItems[] = $tache;
        }

        return response()->json($updatedItems, 200);
    }

    // Suppression d'une tâche
    public function destroy($id)
    {
        $tache = Tache::findOrFail($id);
        $tache->delete();

        return redirect()->route('taches.index')->with('success', 'Tâche supprimée avec succès.');
    }
}
