<?php

namespace App\Http\Controllers;

use App\Models\RendezVous;
use App\Events\RendezVousCreated;
use App\Notifications\RendezVousNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class RendezVousController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'date' => 'required|date',
            'heure' => 'required',
            'doctor_id' => 'required|exists:users,id',
            'patient_id' => 'required|exists:users,id',
        ]);

        $rendezVous = RendezVous::create($request->all());

        // Déclencher l'événement
        event(new RendezVousCreated($rendezVous));

        // Envoyer les notifications
        $rendezVous->doctor->notify(new RendezVousNotification($rendezVous, 'doctor'));
        $rendezVous->patient->notify(new RendezVousNotification($rendezVous, 'patient'));

        // Notifier les infirmières
        $nurses = User::where('role', 'nurse')->get();
        foreach ($nurses as $nurse) {
            $nurse->notify(new RendezVousNotification($rendezVous, 'nurse'));
        }

        return response()->json([
            'message' => 'Rendez-vous créé avec succès',
            'rendez_vous' => $rendezVous
        ]);
    }
} 