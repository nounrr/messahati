<?php

namespace App\Http\Controllers\Statestiques\StatestiqueDiagramme;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;

class StatistiquesTraitements extends Controller
{
    /**
     * Retourne le nombre de rendez-vous par heure et par type de traitement.
     */
    public function getStatistiquesParHeure()
    {
        try {
            $stats = DB::table('rendez_vous')
                ->join('traitements', 'rendez_vous.traitement_id', '=', 'traitements.id')
                ->join('type_traitements', 'traitements.typetraitement_id', '=', 'type_traitements.id')
                ->select(
                    DB::raw('HOUR(rendez_vous.date_heure) as heure'),
                    'type_traitements.nom as type',
                    DB::raw('COUNT(*) as total')
                )
                ->whereDate('rendez_vous.date_heure', Carbon::today())
                ->groupBy('heure', 'type')
                ->orderBy('heure')
                ->get();

            // Si aucune donnée n'est trouvée, retourner des données par défaut
            if ($stats->isEmpty()) {
                $defaultData = [];
                $types = ['Consultation générale', 'Consultation spécialisée', 'Consultation d\'urgence'];
                
                for ($heure = 8; $heure <= 17; $heure++) {
                    foreach ($types as $type) {
                        $defaultData[] = [
                            'heure' => $heure,
                            'type' => $type,
                            'total' => 0
                        ];
                    }
                }
                
                return response()->json($defaultData);
            }

            return response()->json($stats);
        } catch (\Exception $e) {
            Log::error('Erreur dans getStatistiquesParHeure: ' . $e->getMessage());
            return response()->json([
                'error' => 'Une erreur est survenue lors de la récupération des données',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}    