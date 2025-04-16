<?php

namespace App\Http\Controllers;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class StatistiqueRevenue extends Controller
{
    public function getRevenus()
    {
        $revenus = [];
    
        // Récupérer les dates uniques dans les paiements valides
        $dates = DB::table('payments')
            ->select(DB::raw('DATE(date) as jour'))
            ->where('status', true)
            ->groupBy('jour')
            ->pluck('jour');
    
        foreach ($dates as $date) {
            // Crédit : paiements reçus
            $credit = DB::table('payments')
                ->whereDate('date', $date)
                ->where('status', true)
                ->sum('montant');
    
            // Débit : salaires + charges
            $salaires = DB::table('salaires')
                ->whereDate('date', $date)
                ->sum(DB::raw('montant + primes'));
    
            $charges = DB::table('charges')
                ->whereDate('created_at', $date)
                ->sum(DB::raw('prix_unitaire * quantite'));
    
            $debit = $salaires + $charges;
    
            $revenus[] = [
                'date' => $date,
                'credit' => $credit,
                'debit' => $debit,
                'revenu_net' => $credit - $debit
            ];
        }
    
        return response()->json($revenus);
    }
    

}
