<?php

namespace App\Http\Controllers\Statestiques\StatestiqueDiagramme;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use App\Models\User;
use Carbon\Carbon;

class StatestiqueAge extends Controller
{
    public function repartitionPatients(): JsonResponse
    {
        try {
            // Sélectionner tous les utilisateurs avec le rôle 'patient'
            $patients = User::role('patient')->get();
            $total = $patients->count();

            if ($total === 0) {
                return response()->json([
                    'hommes' => 0,
                    'femmes' => 0,
                    'enfants' => 0,
                    'total' => 0
                ]);
            }

            $hommes = 0;
            $femmes = 0;
            $enfants = 0;

            foreach ($patients as $patient) {
                $age = Carbon::parse($patient->date_naissance)->age;

                if ($age <= 12) {
                    $enfants++;
                } elseif ($patient->sexe === 'homme') {
                    $hommes++;
                } elseif ($patient->sexe === 'femme') {
                    $femmes++;
                }
            }

            return response()->json([
                'hommes' => round(($hommes / $total) * 100),
                'femmes' => round(($femmes / $total) * 100),
                'enfants' => round(($enfants / $total) * 100),
                'total' => $total,
                'details' => [
                    'nombre_hommes' => $hommes,
                    'nombre_femmes' => $femmes,
                    'nombre_enfants' => $enfants
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Une erreur est survenue lors du calcul des statistiques',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
