<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Payment;
use App\Models\User;
use App\Models\Notification;
use App\Models\Rendezvous;
use App\Models\Role;

class PaymentController extends Controller
{
    // Affiche la liste des paiements
    public function index()
    {
        $payments = Payment::all();
        return response()->json($payments);
    }

    // Affiche le formulaire de création
    public function create()
    {
        return view('payments.create');
    }

    // Enregistre plusieurs paiements (instanciation explicite)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'payments' => 'required|array',
            'payments.*.rendez_vous_id' => 'required|exists:rendez_vous,id',
            'payments.*.montant' => 'required|numeric',
            'payments.*.date' => 'required|date',
            'payments.*.status' => 'required|in:0,1' // 0 = non payé, 1 = payé
        ]);

        $createdItems = [];

        foreach ($validated['payments'] as $data) {
            $payment = new Payment();
            $payment->rendez_vous_id = $data['rendez_vous_id'];
            $payment->montant = $data['montant'];
            $payment->date = $data['date'];
            $payment->status = $data['status'];
            $payment->save();

            // Récupérer le rendez-vous et les utilisateurs concernés
            $rendezvous = Rendezvous::with(['patient', 'docteur'])->find($data['rendez_vous_id']);
            
            if ($rendezvous) {
                // Notification pour le patient
                $patientNotification = Notification::create([
                    'date' => now()->toDateString(),
                    'statut' => true
                ]);

                $statusText = $data['status'] == 1 ? 'payé' : 'non payé';
                $patientNotification->users()->attach($rendezvous->patient_id, [
                    'message' => "Paiement {$statusText} pour votre rendez-vous du {$rendezvous->date_heure} - Montant: {$data['montant']} DH"
                ]);

                // Notification pour l'administrateur financier
                $adminRole = Role::where('name', 'administrateur_financier')->first();
                if ($adminRole) {
                    $adminUsers = $adminRole->users;
                    foreach ($adminUsers as $adminUser) {
                        $adminNotification = Notification::create([
                            'date' => now()->toDateString(),
                            'statut' => true
                        ]);

                        $adminNotification->users()->attach($adminUser->id, [
                            'message' => "Nouveau paiement {$statusText} - Patient: {$rendezvous->patient->name}, Montant: {$data['montant']} DH, Date: {$data['date']}"
                        ]);
                    }
                }
            }

            $createdItems[] = $payment;
        }

        return response()->json($createdItems, 201);
    }

    // Affiche un paiement
    public function show($id)
    {
        $payment = Payment::findOrFail($id);
        return response()->json($payment);
    }

    // Affiche le formulaire d'édition
    public function edit($id)
    {
        $payment = Payment::findOrFail($id);
        return view('payments.edit', compact('payment'));
    }

    // Met à jour plusieurs paiements (instanciation explicite)
    public function update(Request $request)
    {
        $validated = $request->validate([
            'updates' => 'required|array',
            'updates.*.id' => 'required|exists:payments,id',
            'updates.*.rendez_vous_id' => 'required|exists:rendez_vous,id',
            'updates.*.montant' => 'required|numeric',
            'updates.*.date' => 'required|date',
            'updates.*.status' => 'required|in:0,1' // 0 = non payé, 1 = payé
        ]);

        $updatedItems = [];

        foreach ($validated['updates'] as $data) {
            $payment = Payment::findOrFail($data['id']);
            $oldValues = $payment->getAttributes();
            
            $payment->rendez_vous_id = $data['rendez_vous_id'];
            $payment->montant = $data['montant'];
            $payment->date = $data['date'];
            $payment->status = $data['status'];
            $payment->save();

            // Récupérer le rendez-vous et les utilisateurs concernés
            $rendezvous = Rendezvous::with(['patient', 'docteur'])->find($data['rendez_vous_id']);
            
            if ($rendezvous) {
                // Notification pour le patient
                $patientNotification = Notification::create([
                    'date' => now()->toDateString(),
                    'statut' => true
                ]);

                $statusText = $data['status'] == 1 ? 'payé' : 'non payé';
                $patientNotification->users()->attach($rendezvous->patient_id, [
                    'message' => "Mise à jour du paiement pour votre rendez-vous du {$rendezvous->date_heure} - Nouveau montant: {$data['montant']} DH"
                ]);

                // Notification pour l'administrateur financier
                $adminRole = Role::where('name', 'administrateur_financier')->first();
                if ($adminRole) {
                    $adminUsers = $adminRole->users;
                    foreach ($adminUsers as $adminUser) {
                        $adminNotification = Notification::create([
                            'date' => now()->toDateString(),
                            'statut' => true
                        ]);

                        $adminNotification->users()->attach($adminUser->id, [
                            'message' => "Mise à jour du paiement - Patient: {$rendezvous->patient->name}, Ancien montant: {$oldValues['montant']} DH, Nouveau montant: {$data['montant']} DH"
                        ]);
                    }
                }
            }

            $updatedItems[] = $payment;
        }

        return response()->json($updatedItems, 200);
    }

    // Supprime un paiement
    public function destroy($id)
    {
        $payment = Payment::findOrFail($id);
        
        // Récupérer le rendez-vous et les utilisateurs concernés
        $rendezvous = Rendezvous::with(['patient', 'docteur'])->find($payment->rendez_vous_id);
        
        if ($rendezvous) {
            // Notification pour le patient
            $patientNotification = Notification::create([
                'date' => now()->toDateString(),
                'statut' => true
            ]);

            $patientNotification->users()->attach($rendezvous->patient_id, [
                'message' => "Suppression du paiement pour votre rendez-vous du {$rendezvous->date_heure} - Montant: {$payment->montant} DH"
            ]);

            // Notification pour l'administrateur financier
            $adminRole = Role::where('name', 'administrateur_financier')->first();
            if ($adminRole) {
                $adminUsers = $adminRole->users;
                foreach ($adminUsers as $adminUser) {
                    $adminNotification = Notification::create([
                        'date' => now()->toDateString(),
                        'statut' => true
                    ]);

                    $adminNotification->users()->attach($adminUser->id, [
                        'message' => "Suppression du paiement - Patient: {$rendezvous->patient->name}, Montant: {$payment->montant} DH"
                    ]);
                }
            }
        }

        $payment->delete();
        return response()->json(null, 204);
    }
}
