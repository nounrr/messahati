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
        $validatedData = $request->validate([
            'rendezvous' => 'required|array',
            'rendezvous.*.date' => 'required|date',
            'rendezvous.*.heure' => 'required|string',
            'rendezvous.*.description' => 'nullable|string',
        ]);

        foreach ($validatedData['rendezvous'] as $data) {
            RendezVous::create($data);
        }

        return response()->json(['message' => 'Rendez-vous créés avec succès.']);
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

    public function update(Request $request, string $id = null)
    {
        $validatedData = $request->validate([
            'rendezvous' => 'required|array',
            'rendezvous.*.id' => 'required|exists:rendez_vous,id',
            'rendezvous.*.date' => 'required|date',
            'rendezvous.*.heure' => 'required|string',
            'rendezvous.*.description' => 'nullable|string',
        ]);

        foreach ($validatedData['rendezvous'] as $data) {
            $rendezVous = RendezVous::find($data['id']);
            $rendezVous->update($data);
        }

        return response()->json(['message' => 'Rendez-vous mis à jour avec succès.']);
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
