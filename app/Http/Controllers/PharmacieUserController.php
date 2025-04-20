<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Medicament;
use App\Models\User;

class PharmacieUserController extends Controller
{
    /**
     * Afficher toutes les relations pharmacie_user.
     */
    public function index()
    {
        $pharmacieUsers = \DB::table('pharmacie_user')->get();
        return response()->json($pharmacieUsers);
    }

    /**
     * Créer une nouvelle relation pharmacie_user.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'medicament_id' => 'required|exists:medicaments,id',
            'user_id' => 'required|exists:users,id',
            'payment' => 'required|boolean',
            'statut' => 'required|in:en cours,done,en attente',
            'quantite' => 'required|integer|min:1',
        ]);

        \DB::table('pharmacie_user')->insert($validated);

        return response()->json(['message' => 'Relation ajoutée avec succès.'], 201);
    }

    /**
     * Afficher une relation spécifique.
     */
    public function show($id)
    {
        $pharmacieUser = \DB::table('pharmacie_user')->find($id);

        if (!$pharmacieUser) {
            return response()->json(['message' => 'Relation introuvable.'], 404);
        }

        return response()->json($pharmacieUser);
    }

    /**
     * Mettre à jour une relation existante.
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'medicament_id' => 'sometimes|exists:medicaments,id',
            'user_id' => 'sometimes|exists:users,id',
            'payment' => 'sometimes|boolean',
            'statut' => 'sometimes|in:en cours,done,en attente',
            'quantite' => 'sometimes|integer|min:1',
        ]);

        $updated = \DB::table('pharmacie_user')->where('id', $id)->update($validated);

        if (!$updated) {
            return response()->json(['message' => 'Relation introuvable ou non modifiée.'], 404);
        }

        return response()->json(['message' => 'Relation mise à jour avec succès.']);
    }

    /**
     * Supprimer une relation.
     */
    public function destroy($id)
    {
        $deleted = \DB::table('pharmacie_user')->where('id', $id)->delete();

        if (!$deleted) {
            return response()->json(['message' => 'Relation introuvable.'], 404);
        }

        return response()->json(['message' => 'Relation supprimée avec succès.']);
    }
}
