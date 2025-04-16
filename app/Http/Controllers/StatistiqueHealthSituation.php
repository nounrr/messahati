<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use Spatie\Permission\Models\Role;
class StatistiqueHealthSituation extends Controller
{
 
    
    public function statistiquesSante()
    {
        // Récupérer les patients via Spatie
        $patients = User::role('patient'); // Méthode du package Spatie
    
        $total = $patients->count();
    
        // Patients malades
        $malades = (clone $patients)->where('status_maladie', true)->count();
    
        // Patients en bonne santé
        $sains = $total - $malades;
    
        // Pourcentages
        $healthRate = $total > 0 ? round(($sains / $total) * 100, 2) : 0;
        $sickRate = $total > 0 ? round(($malades / $total) * 100, 2) : 0;
    
        return response()->json([
            'patients_health_rate' => $healthRate,
            'patients_sick_rate' => $sickRate
        ]);
    }
}    