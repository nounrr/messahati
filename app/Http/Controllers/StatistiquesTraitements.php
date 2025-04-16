<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
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
                    DB::raw('HOUR(rendez_vous.date_heure) as heure'), // Utiliser 'date_heure' pour obtenir l'heure
                    'type_traitements.nom as type',
                    DB::raw('COUNT(*) as total')
                )
                ->groupBy('heure', 'type')
                ->orderBy('heure')
                ->get();
    
            // Si aucune donnée, retour de la réponse vide
            if ($stats->isEmpty()) {
                return response()->json(['message' => 'Aucune donnée disponible.'], 200);
            }
    
            $formatted = [];
            foreach ($stats as $stat) {
                $formatted[] = [
                    'heure' => (int) $stat->heure,
                    'type' => $stat->type,
                    'total' => $stat->total,
                ];
            }
    
            return response()->json($formatted);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Une erreur est survenue.',
                'exception_message' => $e->getMessage(),
                'exception_file' => $e->getFile(),
                'exception_line' => $e->getLine(),
            ], 500);
        }
    }
}    