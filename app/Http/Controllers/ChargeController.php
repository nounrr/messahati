<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Charge;
use App\Exports\ChargeExport;
use App\Traits\ExcelExportImport;

class ChargeController extends Controller
{
    use ExcelExportImport;

    public function index()
    {
        $charges = Charge::with('partenaire')->get();
        return response()->json($charges);
    }

    public function create()
    {
        return view('charges.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'charges.*.nom' => 'required|string',
            'charges.*.prix_unitaire' => 'required|numeric',
            'charges.*.quantite' => 'required|numeric',
            'charges.*.partenaire_id' => 'required|exists:partenaires,id',
            'charges.*.status' => 'required|in:paye,en_attente,annule'
        ]);

        $createdItems = [];

        foreach ($validated['charges'] as $data) {
            $item = new Charge();
            $item->nom = $data['nom'];
            $item->prix_unitaire = $data['prix_unitaire'];
            $item->quantite = $data['quantite'];
            $item->partenaire_id = $data['partenaire_id'];
            $item->status = $data['status'];
            $item->save();

            $createdItems[] = $item;
        }

        return response()->json($createdItems, 201);
    }

    public function show($id)
    {
        $charge = Charge::with('partenaire')->findOrFail($id);
        return response()->json($charge);
    }

    public function edit($id)
    {
        $charge = Charge::with('partenaire')->findOrFail($id);
        return view('charges.edit', compact('charge'));
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'updates' => 'required|array',
            'updates.*.id' => 'required|exists:charges,id',
            'updates.*.nom' => 'required|string',
            'updates.*.prix_unitaire' => 'required|numeric',
            'updates.*.quantite' => 'required|numeric',
            'updates.*.partenaire_id' => 'required|exists:partenaires,id',
            'updates.*.status' => 'required|in:paye,en_attente,annule'
        ]);

        $updatedItems = [];

        foreach ($validated['updates'] as $data) {
            $item = Charge::findOrFail($data['id']);
            $item->nom = $data['nom'];
            $item->prix_unitaire = $data['prix_unitaire'];
            $item->quantite = $data['quantite'];
            $item->partenaire_id = $data['partenaire_id'];
            $item->status = $data['status'];
            $item->save();

            $updatedItems[] = $item->load('partenaire');
        }

        return response()->json($updatedItems, 200);
    }

    public function destroy(Request $request, string $id = null)
    {
        try {
            if ($id) {
                $charge = Charge::findOrFail($id);
                $charge->delete();
                return response()->json(['message' => 'Charge deleted successfully']);
            } else {
                $ids = $request->validate([
                    'ids' => 'required|array',
                    'ids.*' => 'required|integer|exists:charges,id'
                ])['ids'];
                
                Charge::whereIn('id', $ids)->delete();
                return response()->json(['message' => 'Charges deleted successfully']);
            }
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error deleting charges', 'error' => $e->getMessage()], 500);
        }
    }

    public function export()
    {
        return $this->exportExcel(ChargeExport::class, 'charges.xlsx', null);
    }
}
