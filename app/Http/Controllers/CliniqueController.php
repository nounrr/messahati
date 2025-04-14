<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Clinique;
use Illuminate\Support\Facades\Storage;

class CliniqueController extends Controller
{
    public function index()
    {
        $cliniques = Clinique::all();
        return response()->json($cliniques);
    }

    public function create()
    {
        return view('cliniques.create');
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'cliniques' => 'required|array',
            'cliniques.*.nom' => 'required|string|max:255',
            'cliniques.*.adresse' => 'required|string|max:255',
            'cliniques.*.email' => 'required|email',
            'cliniques.*.site_web' => 'nullable|string',
            'cliniques.*.description' => 'nullable|string',
        ]);

        $createdCliniques = [];

        foreach ($validatedData['cliniques'] as $key => $data) {
            $clinique = new Clinique();
            $clinique->nom = $data['nom'];
            $clinique->adresse = $data['adresse'];
            $clinique->email = $data['email'];
            $clinique->site_web = $data['site_web'] ?? null;
            $clinique->description = $data['description'] ?? null;
            
            if ($request->hasFile("cliniques.$key.logo")) {
                $file = $request->file("cliniques.$key.logo");
                $path = $file->store('cliniques', 'public');
                $clinique->logo_path = $path;
            }
            
            $clinique->save();
            $createdCliniques[] = $clinique;
        }

        return response()->json($createdCliniques);
    }

    public function show($id)
    {
        $clinique = Clinique::findOrFail($id);
        return response()->json($clinique);
    }

    public function edit($id)
    {
        $clinique = Clinique::findOrFail($id);
        return view('cliniques.edit', compact('clinique'));
    }

    public function update(Request $request, string $id = null)
    {
        $validatedData = $request->validate([
            'cliniques' => 'required|array',
            'cliniques.*.id' => 'required|exists:cliniques,id',
            'cliniques.*.nom' => 'required|string|max:255',
            'cliniques.*.adresse' => 'required|string|max:255',
            'cliniques.*.email' => 'required|email',
            'cliniques.*.site_web' => 'nullable|url',
            'cliniques.*.description' => 'nullable|string',
        ]);

        $updatedCliniques = [];

        foreach ($validatedData['cliniques'] as $key => $data) {
            $clinique = Clinique::find($data['id']);
            
            $clinique->nom = $data['nom'];
            $clinique->adresse = $data['adresse'];
            $clinique->email = $data['email'];
            $clinique->site_web = $data['site_web'] ?? null;
            $clinique->description = $data['description'] ?? null;
            
            if ($request->hasFile("cliniques.$key.logo")) {
                // Supprimer l'ancien logo s'il existe
                if ($clinique->logo_path && Storage::disk('public')->exists($clinique->logo_path)) {
                    Storage::disk('public')->delete($clinique->logo_path);
                }
                
                $file = $request->file("cliniques.$key.logo");
                $path = $file->store('cliniques', 'public');
                $clinique->logo_path = $path;
            }
            
            $clinique->save();
            $updatedCliniques[] = $clinique;
        }

        return response()->json($updatedCliniques);
    }

    public function destroy(Request $request, string $id = null)
    {
        if ($id) {
            $clinique = Clinique::findOrFail($id);
            $clinique->delete();
        } else {
            $validatedData = $request->validate([
                'ids' => 'required|array',
                'ids.*' => 'required|exists:cliniques,id',
            ]);

            Clinique::whereIn('id', $validatedData['ids'])->delete();
        }

        return response()->json(['message' => 'Cliniques supprimées avec succès.']);
    }
}

