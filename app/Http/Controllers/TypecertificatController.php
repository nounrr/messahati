<?php

namespace App\Http\Controllers;

use App\Models\TypeCertificat;
use Illuminate\Http\Request;

class TypecertificatController extends Controller
{
    // Liste des types de certificats
    public function index()
    {
        $typeCertificats = TypeCertificat::all();
        return response()->json($typeCertificats);
    }

    // Formulaire de création (inutile en API)
    public function create()
    {
        // API only
    }

    // Enregistrement de plusieurs types de certificats
    public function store(Request $request)
    {
        $validated = $request->validate([
            'typecertificats' => 'required|array',
            'typecertificats.*.type_certificat' => 'required|string',
            'typecertificats.*.description' => 'required|string'
        ]);

        $createdItems = [];

        foreach ($validated['typecertificats'] as $data) {
            $typeCertificat = new TypeCertificat();
            $typeCertificat->type_certificat = $data['type_certificat'];
            $typeCertificat->description = $data['description'];
            $typeCertificat->save();

            $createdItems[] = $typeCertificat;
        }

        return response()->json($createdItems, 201);
    }

    // Affiche un type de certificat
    public function show(string $id)
    {
        $typeCertificat = TypeCertificat::findOrFail($id);
        return response()->json($typeCertificat);
    }

    // Formulaire d’édition (inutile en API)
    public function edit(string $id)
    {
        // API only
    }

    // Mise à jour de plusieurs types de certificats
    public function update(Request $request)
    {
        $validated = $request->validate([
            'updates' => 'required|array',
            'updates.*.id' => 'required|exists:typecertificats,id',
            'updates.*.type_certificat' => 'required|string',
            'updates.*.description' => 'required|string'
        ]);

        $updatedItems = [];

        foreach ($validated['updates'] as $data) {
            $typeCertificat = TypeCertificat::findOrFail($data['id']);
            $typeCertificat->type_certificat = $data['type_certificat'];
            $typeCertificat->description = $data['description'];
            $typeCertificat->save();

            $updatedItems[] = $typeCertificat;
        }

        return response()->json($updatedItems, 200);
    }

    // Suppression
    public function destroy(string $id)
    {
        $typeCertificat = TypeCertificat::findOrFail($id);
        $typeCertificat->delete();

        return response()->json(['message' => 'Type de certificat supprimé avec succès.'], 200);
    }
    
}
