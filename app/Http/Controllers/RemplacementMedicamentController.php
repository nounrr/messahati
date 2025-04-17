<?php

namespace App\Http\Controllers;

use App\Models\RemplacementMedicament;
use Illuminate\Http\Request;

class RemplacementMedicamentController extends Controller
{
    /**
     * Afficher une liste des remplacements.
     */
    public function index()
    {
        $remplacements = RemplacementMedicament::with(['medicament', 'medicamentRemplacement'])->get();
        return response()->json($remplacements);
    }

    /**
     * Créer un nouveau remplacement.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'medicament_id' => 'required|exists:medicaments,id',
            'medicament_remplacement_id' => 'required|exists:medicaments,id',
            'raison' => 'nullable|string',
        ]);

        $remplacement = RemplacementMedicament::create($validated);
        return response()->json($remplacement, 201);
    }

    /**
     * Afficher un remplacement spécifique.
     */
    public function show($id)
    {
        $remplacement = RemplacementMedicament::with(['medicament', 'medicamentRemplacement'])->findOrFail($id);
        return response()->json($remplacement);
    }

    /**
     * Mettre à jour un remplacement existant.
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'medicament_id' => 'sometimes|exists:medicaments,id',
            'medicament_remplacement_id' => 'sometimes|exists:medicaments,id',
            'raison' => 'nullable|string',
        ]);

        $remplacement = RemplacementMedicament::findOrFail($id);
        $remplacement->update($validated);
        return response()->json($remplacement);
    }

    /**
     * Supprimer un remplacement.
     */
    public function destroy($id)
    {
        $remplacement = RemplacementMedicament::findOrFail($id);
        $remplacement->delete();
        return response()->json(['message' => 'Remplacement supprimé avec succès.']);
    }
}
