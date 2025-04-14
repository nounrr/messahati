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
            $item = new CertificatMedicale();
            $item->description = $data['description'];
            $item->date_emission = $data['date_emission'];
            $item->typecertificat_id = $data['typecertificat_id'];
            $item->traitement_id = $data['traitement_id'];
            $item->save();

            $createdItems[] = $item;
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
            $item->description = $data['description'];
            $item->date_emission = $data['date_emission'];
            $item->typecertificat_id = $data['typecertificat_id'];
            $item->traitement_id = $data['traitement_id'];
            $item->save();

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

    public function generateEditor($id)
{
    $typeCertificat = TypeCertificat::findOrFail($id);

    // Analyse du contenu pour détecter les variables et les inputs
    $description = $typeCertificat->description;

    // Remplace (texte fixe) => <input>
    $description = preg_replace_callback('/\((.*?)\)/', function ($matches) {
        return '<input type="text" name="inputs[]" value="' . $matches[1] . '">';
    }, $description);

    // Remplace @variable => <select>
    $description = preg_replace_callback('/@(\w+)/', function ($matches) {
        $name = $matches[1];
        return "<select name='{$name}'>" .
            "<option value=''>-- Choisir {$name} --</option>" .
            "</select>";
    }, $description);

    return response()->json([
        'editor_html' => $description,
        'type_certificat' => $typeCertificat->type_certificat
    ]);
}

}
