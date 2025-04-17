<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Salaire;
use App\Models\Notification;
use App\Models\User;

class SalaireController extends Controller
{
    // Liste des salaires
    public function index()
    {
        $salaires = Salaire::all();
        return response()->json($salaires);
    }

    // Formulaire de création
    public function create()
    {
        return view('salaires.create');
    }

    // Enregistrement de plusieurs salaires
    public function store(Request $request)
    {
        $validated = $request->validate([
            'salaires' => 'required|array',
            'salaires.*.montant' => 'required|numeric',
            'salaires.*.primes' => 'required|numeric',
            'salaires.*.date' => 'required|date',
            'salaires.*.user_id' => 'required|exists:users,id',
        ]);

        $created = [];

        foreach ($validated['salaires'] as $data) {
            $salaire = new Salaire();
            $salaire->montant = $data['montant'];
            $salaire->primes = $data['primes'];
            $salaire->date = $data['date'];
            $salaire->user_id = $data['user_id'];
            $salaire->save();

            // Créer une notification pour l'utilisateur
            $user = User::find($data['user_id']);
            if ($user) {
                $notification = Notification::create([
                    'date' => now()->toDateString(),
                    'statut' => true
                ]);

                $notification->users()->attach($user->id, [
                    'message' => "Votre salaire pour {$data['date']} a été fixé à {$data['montant']} DH (primes: {$data['primes']} DH)"
                ]);

                // Créer une notification pour l'administrateur financier
                $admin = User::where('role', 'admin_financier')->first();
                if ($admin) {
                    $adminNotification = Notification::create([
                        'date' => now()->toDateString(),
                        'statut' => true
                    ]);

                    $adminNotification->users()->attach($admin->id, [
                        'message' => "Salaire fixé pour {$user->name} - Montant: {$data['montant']} DH (primes: {$data['primes']} DH) pour {$data['date']}"
                    ]);
                }
            }

            $created[] = $salaire;
        }

        return response()->json($created, 201);
    }

    // Affiche un salaire
    public function show($id)
    {
        $salaire = Salaire::findOrFail($id);
        return response()->json($salaire);
    }

    // Formulaire d'édition
    public function edit($id)
    {
        $salaire = Salaire::findOrFail($id);
        return view('salaires.edit', compact('salaire'));
    }

    // Mise à jour de plusieurs salaires
    public function update(Request $request)
    {
        $validated = $request->validate([
            'salaires' => 'required|array',
            'salaires.*.id' => 'required|exists:salaires,id',
            'salaires.*.montant' => 'required|numeric',
            'salaires.*.primes' => 'required|numeric',
            'salaires.*.date' => 'required|date',
            'salaires.*.user_id' => 'required|exists:users,id',
        ]);

        $updated = [];

        foreach ($validated['salaires'] as $data) {
            $salaire = Salaire::findOrFail($data['id']);
            $oldValues = $salaire->getAttributes();
            
            $salaire->montant = $data['montant'];
            $salaire->primes = $data['primes'];
            $salaire->date = $data['date'];
            $salaire->user_id = $data['user_id'];
            $salaire->save();

            // Créer une notification pour l'utilisateur
            $user = User::find($data['user_id']);
            if ($user) {
                $notification = Notification::create([
                    'date' => now()->toDateString(),
                    'statut' => true
                ]);

                $notification->users()->attach($user->id, [
                    'message' => "Mise à jour de votre salaire pour {$data['date']} - Nouveau montant: {$data['montant']} DH (primes: {$data['primes']} DH)"
                ]);

                // Créer une notification pour l'administrateur financier
                $admin = User::where('role', 'admin_financier')->first();
                if ($admin) {
                    $adminNotification = Notification::create([
                        'date' => now()->toDateString(),
                        'statut' => true
                    ]);

                    $adminNotification->users()->attach($admin->id, [
                        'message' => "Salaire mis à jour pour {$user->name} - Nouveau montant: {$data['montant']} DH (primes: {$data['primes']} DH) pour {$data['date']}"
                    ]);
                }
            }

            $updated[] = $salaire;
        }

        return response()->json($updated, 200);
    }

    // Suppression d'un salaire
    public function destroy($id)
    {
        $salaire = Salaire::findOrFail($id);
        
        // Créer une notification pour l'utilisateur
        $user = User::find($salaire->user_id);
        if ($user) {
            $notification = Notification::create([
                'date' => now()->toDateString(),
                'statut' => true
            ]);

            $notification->users()->attach($user->id, [
                'message' => "Suppression de votre salaire pour {$salaire->date} - Montant: {$salaire->montant} DH (primes: {$salaire->primes} DH)"
            ]);

            // Créer une notification pour l'administrateur financier
            $admin = User::where('role', 'admin_financier')->first();
            if ($admin) {
                $adminNotification = Notification::create([
                    'date' => now()->toDateString(),
                    'statut' => true
                ]);

                $adminNotification->users()->attach($admin->id, [
                    'message' => "Salaire supprimé pour {$user->name} - Montant: {$salaire->montant} DH (primes: {$salaire->primes} DH) pour {$salaire->date}"
                ]);
            }
        }

        $salaire->delete();
        return response()->json(null, 204);
    }
}
