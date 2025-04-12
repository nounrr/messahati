<?php

namespace App\Http\Controllers;

use App\Models\TypeCertificat;
use Illuminate\Http\Request;

class TypecertificatController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $typeCertificats = TypeCertificat::all();
        return response()->json($typeCertificats);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // If you're using API only, this may not be needed.
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'typecertificats.*.type_certificat' => 'required|string',
            'typecertificats.*.description' => 'required|string'
        ]);

        $createdItems = [];
        foreach ($validated['typecertificats'] as $data) {
            $createdItems[] = TypeCertificat::create($data);
        }

        return response()->json($createdItems, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $typeCertificat = TypeCertificat::findOrFail($id);
        return response()->json($typeCertificat);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        // If you're using API only, this may not be needed.
    }

    /**
     * Update the specified resource in storage.
     */
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
            $item = TypeCertificat::findOrFail($data['id']);
            $item->update($data);
            $updatedItems[] = $item;
        }

        return response()->json($updatedItems, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $typeCertificat = TypeCertificat::findOrFail($id);
        $typeCertificat->delete();

        return response()->json(['message' => 'Type de certificat supprimé avec succès.'], 200);
    }
}
