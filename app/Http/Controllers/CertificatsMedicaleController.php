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
        $validated = $request->validate([
            'certificats_medicale.*.description' => 'required|string',
            'certificats_medicale.*.date_emission' => 'required|date',
            'certificats_medicale.*.typecertificat_id' => 'required|exists:typecertificats,id',
            'certificats_medicale.*.traitement_id' => 'required|exists:traitements,id'
        ]);
    
        $createdItems = [];
        foreach ($validated['certificats_medicale'] as $data) {
            
            $createdItems[] = CertificatMedicale::create($data);
        }
    
        return response()->json($createdItems, 201);
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

    public function update(Request $request)
    {
        $validated = $request->validate([
            'updates' => 'required|array',
            'updates.*.id' => 'required|exists:certificats_medicale,id',
            'updates.*.description' => 'required|string',
            'updates.*.date_emission' => 'required|date',
            'updates.*.typecertificat_id' => 'required|exists:typecertificats,id',
            'updates.*.traitement_id' => 'required|exists:traitements,id'
        ]);
    
        $updatedItems = [];
        foreach ($validated['updates'] as $data) {
            $item = CertificatMedicale::findOrFail($data['id']);
            
            $item->update($data);
            $updatedItems[] = $item;
        }
    
        return response()->json($updatedItems, 200);
    }
    
    public function destroy($id)
    {
        $certificat = CertificatMedicale::findOrFail($id);
        $certificat->delete();

        return redirect()->route('certificats.index')->with('success', 'Certificat médical supprimé avec succès.');
    }
}
