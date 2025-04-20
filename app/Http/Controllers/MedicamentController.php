<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Medicament;

class MedicamentController extends Controller
{
    public function index()
    {
        $medicaments = Medicament::all();
        return response()->json($medicaments);
    }

    public function create()
    {
        return view('medicaments.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'medicaments' => 'required|array',
            'medicaments.*.nom_medicament' => 'required|string',
            'medicaments.*.dosage' => 'nullable|string',
            'medicaments.*.forme' => 'nullable|string',
            'medicaments.*.presentation' => 'nullable|string',
            'medicaments.*.substance_active' => 'nullable|string',
            'medicaments.*.classe_therapeutique' => 'nullable|string',
            'medicaments.*.statut_commercialisation' => 'nullable|string',
            'medicaments.*.prix_ppv' => 'nullable|numeric',
            'medicaments.*.prix_ph' => 'nullable|numeric',
            'medicaments.*.prix_pfht' => 'nullable|numeric',
            'medicaments.*.typemedicaments_id' => 'required|exists:type_medicaments,id',
            'medicaments.*.img_path' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'medicaments.*.remplacement' => 'required|boolean', // Validation pour le champ remplacement
        ]);

        $created = [];

        foreach ($validated['medicaments'] as $index => $data) {
            $medicament = new Medicament($data);

            if ($request->hasFile("medicaments.$index.img_path")) {
                $file = $request->file("medicaments.$index.img_path");
                $filename = time() . '_' . $file->getClientOriginalName();
                $file->storeAs('public/img_path', $filename);
                $medicament->img_path = $filename;
            }

            $medicament->save();
            $created[] = $medicament;
        }

        return response()->json($created, 201);
    }

    public function show($id)
    {
        $medicament = Medicament::findOrFail($id);
        return response()->json($medicament);
    }

    public function edit($id)
    {
        $medicament = Medicament::findOrFail($id);
        return view('medicaments.edit', compact('medicament'));
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'medicaments' => 'required|array',
            'medicaments.*.id' => 'required|exists:medicaments,id',
            'medicaments.*.nom_medicament' => 'required|string',
            'medicaments.*.dosage' => 'nullable|string',
            'medicaments.*.forme' => 'nullable|string',
            'medicaments.*.presentation' => 'nullable|string',
            'medicaments.*.substance_active' => 'nullable|string',
            'medicaments.*.classe_therapeutique' => 'nullable|string',
            'medicaments.*.statut_commercialisation' => 'nullable|string',
            'medicaments.*.prix_ppv' => 'nullable|numeric',
            'medicaments.*.prix_ph' => 'nullable|numeric',
            'medicaments.*.prix_pfht' => 'nullable|numeric',
            'medicaments.*.typemedicaments_id' => 'required|exists:type_medicaments,id',
            'medicaments.*.img_path' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'medicaments.*.remplacement' => 'sometimes|boolean', // Validation pour le champ remplacement
        ]);

        $updated = [];

        foreach ($validated['medicaments'] as $index => $data) {
            $medicament = Medicament::findOrFail($data['id']);

            $medicament->fill($data);

            if ($request->hasFile("medicaments.$index.img_path")) {
                $file = $request->file("medicaments.$index.img_path");
                $filename = time() . '_' . $file->getClientOriginalName();
                $file->storeAs('public/img_path', $filename);
                $medicament->img_path = $filename;
            }

            $medicament->save();
            $updated[] = $medicament;
        }

        return response()->json($updated, 200);
    }

    public function destroy($id)
    {
        $medicament = Medicament::findOrFail($id);
        $medicament->delete();

        return redirect()->route('medicaments.index')->with('success', 'Médicament supprimé avec succès.');
    }
}
