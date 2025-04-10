<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CertificatMedicale;

class CertificatsMedicaleController extends Controller
{
    public function index()
    {
        $certificats = CertificatMedicale::all();
        return response()->json($certificats);
    }

    public function create()
    {
        return view('certificats.create');
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'description' => 'required|string',
            'date_emission' => 'required|date',
            'typecertificat_id' => 'required|exists:typecertificats,id',
            'traitement_id' => 'required|exists:traitements,id',
        ]);

        CertificatMedicale::create($validatedData);

        return redirect()->route('certificats.index')->with('success', 'Certificat médical créé avec succès.');
    }

    public function show($id)
    {
        $certificat = CertificatMedicale::findOrFail($id);
        return response()->json($certificat);
    }

    public function edit($id)
    {
        $certificat = CertificatMedicale::findOrFail($id);
        return view('certificats.edit', compact('certificat'));
    }

    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'description' => 'required|string',
            'date_emission' => 'required|date',
            'typecertificat_id' => 'required|exists:typecertificats,id',
            'traitement_id' => 'required|exists:traitements,id',
        ]);

        $certificat = CertificatMedicale::findOrFail($id);
        $certificat->update($validatedData);

        return redirect()->route('certificats.index')->with('success', 'Certificat médical mis à jour avec succès.');
    }

    public function destroy($id)
    {
        $certificat = CertificatMedicale::findOrFail($id);
        $certificat->delete();

        return redirect()->route('certificats.index')->with('success', 'Certificat médical supprimé avec succès.');
    }
}
