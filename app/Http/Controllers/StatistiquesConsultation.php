<?php

namespace App\Http\Controllers;
use App\Models\Traitement;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Http\Request;

class StatistiquesConsultation extends Controller
{

    public function consultationsParJour()
    {
        // Récupérer les consultations par jour (consultation = type de traitement "consultation")
        $data = Traitement::whereHas('typeTraitement', function ($query) {
                $query->where('nom', 'consultation');
            })
            ->select(
                DB::raw('DAYNAME(date_debut) as jour'),
                DB::raw('COUNT(*) as total')
            )
            ->groupBy('jour')
            ->get();

        // Ordonner les jours dans le bon ordre (lundi -> samedi)
        $jours = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        $resultats = [];

        foreach ($jours as $jourAnglais) {
            $resultats[] = [
                'jour' => ucfirst(Carbon::parse($jourAnglais)->translatedFormat('l')),
                'total' => $data->firstWhere('jour', $jourAnglais)->total ?? 0
            ];
        }

        return response()->json($resultats);
    }
}


