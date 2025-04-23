<?php

namespace App\Http\Controllers\Statestiques\StatestiqueDiagramme;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StatistiquesDepartement extends Controller
{
    public function getPourcentageRendezVousParDepartement()
    {
        try {
            // Get all departments first
            $departments = DB::table('departements')
                ->select('id', 'nom')
                ->get();

            if ($departments->isEmpty()) {
                return response()->json([
                    'message' => 'Aucun département trouvé'
                ], 404);
            }

            // Total de tous les rendez-vous
            $total = DB::table('rendez_vous')->count();

            // If no appointments, return default data
            if ($total === 0) {
                $defaultData = $departments->map(function ($dept) {
                    return [
                        'departement' => $dept->nom,
                        'total' => 0,
                        'pourcentage' => 0.00
                    ];
                });

                return response()->json($defaultData);
            }

            // Groupement par département avec calcul du pourcentage
            $stats = DB::table('rendez_vous')
                ->join('departements', 'rendez_vous.departement_id', '=', 'departements.id')
                ->select(
                    'departements.nom as departement',
                    DB::raw('COUNT(*) as total'),
                    DB::raw('ROUND(COUNT(*) * 100.0 / ' . $total . ', 2) as pourcentage')
                )
                ->groupBy('departement')
                ->orderByDesc('pourcentage')
                ->get();

            // Ensure all departments are included, even those with no appointments
            $result = $departments->map(function ($dept) use ($stats) {
                $stat = $stats->firstWhere('departement', $dept->nom);
                return [
                    'departement' => $dept->nom,
                    'total' => $stat ? $stat->total : 0,
                    'pourcentage' => $stat ? $stat->pourcentage : 0.00
                ];
            });

            return response()->json($result);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Une erreur est survenue lors de la récupération des données',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
