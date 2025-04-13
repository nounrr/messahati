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
            'cliniques.*.site_web' => 'nullable|url',
            'cliniques.*.description' => 'nullable|string',
        ]);

        foreach ($validatedData['cliniques'] as $key => $data) {
            if ($request->hasFile("cliniques.$key.logo")) {
                $logoFile = $request->file("cliniques.$key.logo");
                $cliniqueName = str_replace(' ', '_', strtolower($data['nom']));
                $path = "image/clinique/{$cliniqueName}";
                $logoFile->move(public_path($path), 'logo.png');
                $data['logo_path'] = $path . '/logo.png';
            }
        
            $clinique = new Clinique();
            $clinique->nom = $data['nom'];
            $clinique->adresse = $data['adresse'];
            $clinique->email = $data['email'];
            $clinique->site_web = $data['site_web'] ?? null;
            $clinique->description = $data['description'] ?? null;
            $clinique->logo_path = $data['logo_path'] ?? null;
            $clinique->save();

        }
        

    return response()->json(['message' => 'Cliniques créées avec succès.']);
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

        foreach ($validatedData['cliniques'] as $key => $data) {

            foreach ($validatedData['cliniques'] as $key => $data) {
                $clinique = Clinique::find($data['id']);
            
                if ($request->hasFile("cliniques.$key.logo")) {
                    $logoFile = $request->file("cliniques.$key.logo");
                    $cliniqueName = str_replace(' ', '_', strtolower($data['nom']));
                    $path = "image/clinique/{$cliniqueName}";
            
                    if ($clinique->logo_path && file_exists(public_path($clinique->logo_path))) {
                        unlink(public_path($clinique->logo_path));
                    }
            
                    $logoFile->move(public_path($path), 'logo.png');
                    $data['logo_path'] = $path . '/logo.png';
                }
            
                $clinique->nom = $data['nom'];
                $clinique->adresse = $data['adresse'];
                $clinique->email = $data['email'];
                $clinique->site_web = $data['site_web'] ?? null;
                $clinique->description = $data['description'] ?? null;
                $clinique->logo_path = $data['logo_path'] ?? $clinique->logo_path;
                $clinique->save();
            }
            
        }

    return response()->json(['message' => 'Cliniques mises à jour avec succès.']);
}


    public function destroy($id)
    {
        $clinique = Clinique::findOrFail($id);
        $clinique->delete();

        return redirect()->route('cliniques.index')->with('success', 'Clinique supprimée avec succès.');
    }
}

