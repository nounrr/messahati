<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class StatistiquesDepartement extends Controller
{
    public function getPourcentageRendezVousParDepartement()
{
    // Total de tous les rendez-vous
    $total = DB::table('rendez_vous')->count();

    // Groupement par département avec calcul du pourcentage
    $stats = DB::table('rendez_vous')
        ->join('departements', 'rendez_vous.departement_id', '=', 'departements.id')
        ->select(
            'departements.nom as departement',
            DB::raw('COUNT(*) as total'),
            DB::raw('ROUND(COUNT(*) * 100.0 / ' . ($total ?: 1) . ', 2) as pourcentage')
        )
        ->groupBy('departement')
        ->orderByDesc('pourcentage')
        ->get();

    return response()->json($stats);
}

}
