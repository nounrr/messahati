<?php

namespace App\Http\Controllers\Statestiques\StatestiqueDiagramme;

use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class StatistiqueRevenue extends Controller
{
    public function getRevenus()
    {
        try {
        $revenus = [];
    
            // Get the last 7 days
            $dates = [];
            for ($i = 6; $i >= 0; $i--) {
                $dates[] = Carbon::today()->subDays($i)->format('Y-m-d');
            }
    
        foreach ($dates as $date) {
            // Crédit : paiements reçus
            $credit = DB::table('payments')
                ->whereDate('date', $date)
                ->where('status', true)
                    ->sum('montant') ?? 0;
    
            // Débit : salaires + charges
            $salaires = DB::table('salaires')
                ->whereDate('date', $date)
                    ->sum(DB::raw('COALESCE(montant, 0) + COALESCE(primes, 0)')) ?? 0;
    
            $charges = DB::table('charges')
                ->whereDate('created_at', $date)
                    ->sum(DB::raw('COALESCE(prix_unitaire, 0) * COALESCE(quantite, 0)')) ?? 0;
    
            $debit = $salaires + $charges;
    
            $revenus[] = [
                'date' => $date,
                    'credit' => (float)$credit,
                    'debit' => (float)$debit,
                    'revenu_net' => (float)($credit - $debit)
            ];
        }
    
            return response()->json($revenus, 200, [
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
