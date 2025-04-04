<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Service;

class ServiceController extends Controller
{
    // Récupère et retourne tous les services
    public function index()
    {
        $services = Service::all();
        return response()->json($services);
    }

    // Retourne une vue pour créer un service ou plusieurs (si nécessaire)
    public function create()
    {
        return view('services.create');
    }

    // Valide et enregistre un nouveau service
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'services' => 'required|array',
            'services.*.nom' => 'required|string|max:255',
            'services.*.description' => 'nullable|string',
        ]);

        foreach ($validatedData['services'] as $data) {
            Service::create($data);
        }

        return response()->json(['message' => 'Services créés avec succès.']);
    }

    // Retourne les détails d'un service spécifique
    public function show(string $id)
    {
        $service = Service::findOrFail($id);
        return response()->json($service);
    }

    // Retourne une vue pour modifier un service (si nécessaire)
    public function edit(string $id)
    {
        $service = Service::findOrFail($id);
        return view('services.edit', compact('service'));
    }

    // Met à jour un service ou plusieurs existants
    public function update(Request $request, string $id = null)
    {
        $validatedData = $request->validate([
            'services' => 'required|array',
            'services.*.id' => 'required|exists:services,id',
            'services.*.nom' => 'required|string|max:255',
            'services.*.description' => 'nullable|string',
        ]);

        foreach ($validatedData['services'] as $data) {
            $service = Service::find($data['id']);
            $service->update($data);
        }

        return response()->json(['message' => 'Services mis à jour avec succès.']);
    }

    // Supprime un service ou plusieurs spécifiques
    public function destroy(Request $request, string $id = null)
    {
        if ($id) {
            $service = Service::findOrFail($id);
            $service->delete();
        } else {
            $validatedData = $request->validate([
                'ids' => 'required|array',
                'ids.*' => 'required|exists:services,id',
            ]);

            Service::whereIn('id', $validatedData['ids'])->delete();
        }

        return response()->json(['message' => 'Services supprimés avec succès.']);
    }
}
