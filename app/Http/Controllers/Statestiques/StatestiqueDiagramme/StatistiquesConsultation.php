<?php

namespace App\Http\Controllers\Statestiques\StatestiqueDiagramme;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class StatistiquesConsultation extends Controller
{
    public function consultationsParJour()
    {
        try {
            // Récupérer les consultations des 7 derniers jours
            $consultations = DB::table('traitements')
                ->join('type_traitements', 'traitements.typetraitement_id', '=', 'type_traitements.id')
            ->select(
                    DB::raw('DATE(traitements.date_debut) as jour'),
                DB::raw('COUNT(*) as total')
            )
                ->whereDate('traitements.date_debut', '>=', Carbon::now()->subDays(7))
                ->where('type_traitements.nom', 'like', '%consultation%')
            ->groupBy('jour')
                ->orderBy('jour')
            ->get();

            // Si aucune donnée n'est trouvée, retourner des données par défaut
            if ($consultations->isEmpty()) {
                $consultations = collect();
                for ($i = 6; $i >= 0; $i--) {
                    $date = Carbon::now()->subDays($i);
                    $consultations->push([
                        'jour' => $date->format('Y-m-d'),
                        'total' => 0
                    ]);
                }
            }

            return response()->json($consultations, 200, [
                'Content-Type' => 'application/json',
                'Access-Control-Allow-Origin' => '*',
                'Access-Control-Allow-Methods' => 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers' => 'Content-Type, Authorization, X-Requested-With'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Une erreur est survenue lors de la récupération des données',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}


