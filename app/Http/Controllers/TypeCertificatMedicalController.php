<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TypeCertificatMedical;

class TypeCertificatMedicalController extends Controller
{
    public function index()
    {
        $types = TypeCertificatMedical::all();
        return response()->json($types);
    }

    public function create()
    {
        return view('type-certificat-medical.create');
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'types' => 'required|array',
            'types.*.nom' => 'required|string|max:255',
            'types.*.description' => 'nullable|string',
        ]);

        foreach ($validatedData['types'] as $data) {
            TypeCertificatMedical::create($data);
        }

        return response()->json(['message' => 'Types de certificats médicaux créés avec succès.']);
    }

    public function show(string $id)
    {
        $type = TypeCertificatMedical::findOrFail($id);
        return response()->json($type);
    }

    public function edit(string $id)
    {
        $type = TypeCertificatMedical::findOrFail($id);
        return view('type-certificat-medical.edit', compact('type'));
    }

    public function update(Request $request, string $id = null)
    {
        $validatedData = $request->validate([
            'types' => 'required|array',
            'types.*.id' => 'required|exists:type_certificat_medicals,id',
            'types.*.nom' => 'required|string|max:255',
            'types.*.description' => 'nullable|string',
        ]);

        foreach ($validatedData['types'] as $data) {
            $type = TypeCertificatMedical::find($data['id']);
            $type->update($data);
        }

        return response()->json(['message' => 'Types de certificats médicaux mis à jour avec succès.']);
    }

    public function destroy(Request $request, string $id = null)
    {
        if ($id) {
            $type = TypeCertificatMedical::findOrFail($id);
            $type->delete();
        } else {
            $validatedData = $request->validate([
                'ids' => 'required|array',
                'ids.*' => 'required|exists:type_certificat_medicals,id',
            ]);

            TypeCertificatMedical::whereIn('id', $validatedData['ids'])->delete();
        }

        return response()->json(['message' => 'Types de certificats médicaux supprimés avec succès.']);
    }
}
