<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use App\Models\User;

class StatestiqueAge extends Controller
{
    public function repartitionPatients(): JsonResponse
    {
        // Sélectionner tous les utilisateurs avec le rôle 'patient'
        $patients = User::role('patient')->get();

        $total = $patients->count();

        if ($total === 0) {
            return response()->json([
                'hommes' => 0,
                'femmes' => 0,
                'enfants' => 0,
                'total' => 0,
            ]);
        }

        // Les hommes adultes (plus de 12 ans)
        $hommes = $patients->where('sexe', 'homme')->where('age', '>', 12)->count();

        // Les femmes adultes (plus de 12 ans)
        $femmes = $patients->where('sexe', 'femme')->where('age', '>', 12)->count();

        // Les enfants (12 ans ou moins)
        $enfants = $patients->where('age', '<=', 12)->count();

        return response()->json([
            'hommes' => round(($hommes / $total) * 100),
            'femmes' => round(($femmes / $total) * 100),
            'enfants' => round(($enfants / $total) * 100),
            'total' => $total,
        ]);
    }
}
