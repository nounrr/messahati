<?php

namespace App\Http\Controllers\Statestiques\StatestiqueDiagramme;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Http\JsonResponse;

class StatistiqueHealthSituation extends Controller
{
    public function getHealthCore(): JsonResponse
    {
        // Récupérer tous les utilisateurs avec le rôle 'patient'
        $patients = User::role('patient')->get();
    
        // Compter les patients par statut de maladie
        $total = $patients->count();
        $malades = $patients->where('status_maladie', true)->count();
        $nonMalades = $patients->where('status_maladie', false)->count();
    
        // Calculer les pourcentages
        $pourcentageMalades = $total > 0 ? round(($malades / $total) * 100) : 0;
        $pourcentageNonMalades = $total > 0 ? round(($nonMalades / $total) * 100) : 0;
    
        return response()->json([
            'malades' => $pourcentageMalades,
            'non_malades' => $pourcentageNonMalades,
            'total' => $total
        ]);
    }
}    