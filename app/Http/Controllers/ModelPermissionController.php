<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Permission;

class ModelPermissionController extends Controller
{
    /**
     * Récupérer toutes les permissions attribuées aux utilisateurs
     */
    public function index()
    {
        $modelPermissions = DB::table('model_has_permissions')->get();
        return response()->json($modelPermissions);
    }

    /**
     * Récupérer toutes les permissions d'un utilisateur spécifique
     */
    public function getUserPermissions($userId)
    {
        $userPermissions = DB::table('model_has_permissions')
            ->where('model_id', $userId)
            ->where('model_type', 'App\Models\User')
            ->get();
        
        return response()->json($userPermissions);
    }

    /**
     * Attribuer une permission à un utilisateur
     */
    public function store(Request $request)
    {
        $request->validate([
            'model_id' => 'required|integer',
            'permission_id' => 'required|integer|exists:permissions,id',
            'model_type' => 'required|string'
        ]);

        // Vérifier si l'enregistrement existe déjà
        $exists = DB::table('model_has_permissions')
            ->where('model_id', $request->model_id)
            ->where('permission_id', $request->permission_id)
            ->where('model_type', $request->model_type)
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'Cette permission est déjà attribuée à cet utilisateur'], 422);
        }

        // Créer l'enregistrement
        DB::table('model_has_permissions')->insert([
            'permission_id' => $request->permission_id,
            'model_id' => $request->model_id,
            'model_type' => $request->model_type
        ]);

        return response()->json(['message' => 'Permission attribuée avec succès']);
    }

    /**
     * Retirer une permission d'un utilisateur
     */
    public function destroy(Request $request)
    {
        $request->validate([
            'model_id' => 'required|integer',
            'permission_id' => 'required|integer',
            'model_type' => 'required|string'
        ]);

        DB::table('model_has_permissions')
            ->where('model_id', $request->model_id)
            ->where('permission_id', $request->permission_id)
            ->where('model_type', $request->model_type)
            ->delete();

        return response()->json(['message' => 'Permission retirée avec succès']);
    }

    /**
     * Retirer plusieurs permissions d'un utilisateur
     */
    public function bulkDestroy(Request $request)
    {
        $request->validate([
            'model_id' => 'required|integer',
            'permission_ids' => 'required|array',
            'permission_ids.*' => 'integer',
            'model_type' => 'required|string'
        ]);

        DB::table('model_has_permissions')
            ->where('model_id', $request->model_id)
            ->where('model_type', $request->model_type)
            ->whereIn('permission_id', $request->permission_ids)
            ->delete();

        return response()->json(['message' => 'Permissions retirées avec succès']);
    }
} 