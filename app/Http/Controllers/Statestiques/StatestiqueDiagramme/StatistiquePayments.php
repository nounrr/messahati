<?php
namespace App\Http\Controllers\Statestiques\StatestiqueDiagramme;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class StatistiquePayments extends Controller
{
    public function paiementsParJour()
    {
        // 🔧 Période définie manuellement pour test : 1er au 30 avril
        $startOfMonth = Carbon::now()->startOfDay();
        $endOfMonth = Carbon::now()->endOfDay();

        // Récupérer les paiements validés (status = true) entre ces dates
        $paiements = Payment::select(
                DB::raw('DAYOFWEEK(date) as jour_semaine'),
                DB::raw('SUM(montant) as total')
            )
            ->whereBetween('date', [$startOfMonth, $endOfMonth])
            ->where('status', true)
            ->groupBy(DB::raw('DAYOFWEEK(date)'))
            ->orderBy(DB::raw('DAYOFWEEK(date)'))
            ->get();

        // Associer les jours de la semaine aux indexes DAYOFWEEK (1 = Dimanche, 7 = Samedi)
        $joursSemaine = [1 => 'Sunday', 2 => 'Monday', 3 => 'Tuesday', 4 => 'Wednesday', 5 => 'Thursday', 6 => 'Friday', 7 => 'Saturday'];

        // Formatter les résultats pour inclure les jours sans paiement
        $resultat = collect($joursSemaine)->map(function ($nomJour, $index) use ($paiements) {
            $paiement = $paiements->firstWhere('jour_semaine', $index);
            return [
                'jour' => $nomJour,
                'total' => $paiement ? $paiement->total : 0
            ];
        })->values();

        // Total global
        $totalSemaine = $resultat->sum('total');

        return response()->json([
            'totaux_par_jour' => $resultat,
            'total_mois' => $totalSemaine
        ]);
    }
}
