<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Payment;
use App\Models\Rendezvous;
use App\Exports\PaymentExport;
use App\Traits\ExcelExportImport;

use App\Models\User;
use App\Models\Notification;
use App\Models\RendezVous;

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
        $validatedData = $request->validate([
            'rendez_vous_id' => 'required|exists:rendez_vous,id',
            'montant' => 'required|numeric',
            'date' => 'required|date',
            'status' => 'required|string'
        ]);

        $payment = Payment::create($validatedData);

        // Get the associated appointment and users
        $rendezvous = RendezVous::with('patient')->findOrFail($payment->rendez_vous_id);
        $patient = $rendezvous->patient;
        $admin = User::role('admin-financier')->first();

        // Create notification
        $notification = Notification::create([
            'date' => now(),
            'statut' => 'non_lu'
        ]);

        // Attach notification to patient
        $notification->users()->attach($patient->id, [
            'message' => "Un paiement de {$payment->montant} DH a été effectué pour votre rendez-vous du " . $rendezvous->date
        ]);

        // Attach notification to financial admin
        if ($admin) {
            $notification->users()->attach($admin->id, [
                'message' => "Un nouveau paiement de {$payment->montant} DH a été reçu pour le rendez-vous #" . $rendezvous->id
            ]);
        }

        return response()->json(['message' => 'Payment created successfully', 'payment' => $payment]);
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
    public function update(Request $request, $id)
    {
        $payment = Payment::findOrFail($id);
        $oldAmount = $payment->montant;

        $validatedData = $request->validate([
            'montant' => 'required|numeric',
            'date' => 'required|date',
            'status' => 'required|string'
        ]);

        $payment->update($validatedData);

        // Get the associated appointment and users
        $rendezvous = RendezVous::with('patient')->findOrFail($payment->rendez_vous_id);
        $patient = $rendezvous->patient;
        $admin = User::role('admin-financier')->first();

        // Create notification
        $notification = Notification::create([
            'date' => now(),
            'statut' => 'non_lu'
        ]);

        // Attach notification to patient
        $notification->users()->attach($patient->id, [
            'message' => "Le montant de votre paiement a été modifié de {$oldAmount} DH à {$payment->montant} DH"
        ]);

        // Attach notification to financial admin
        if ($admin) {
            $notification->users()->attach($admin->id, [
                'message' => "Le paiement pour le rendez-vous #{$rendezvous->id} a été modifié de {$oldAmount} DH à {$payment->montant} DH"
            ]);
        }

        return response()->json(['message' => 'Payment updated successfully', 'payment' => $payment]);
    }

    // Supprime un paiement
    public function destroy($id)
    {
        $payment = Payment::findOrFail($id);
        
        // Get the associated appointment and users before deleting the payment
        $rendezvous = RendezVous::with('patient')->findOrFail($payment->rendez_vous_id);
        $patient = $rendezvous->patient;
        $admin = User::role('admin-financier')->first();
        $amount = $payment->montant;

        $payment->delete();

        // Create notification
        $notification = Notification::create([
            'date' => now(),
            'statut' => 'non_lu'
        ]);

        // Attach notification to patient
        $notification->users()->attach($patient->id, [
            'message' => "Le paiement de {$amount} DH pour votre rendez-vous du {$rendezvous->date} a été supprimé"
        ]);

        // Attach notification to financial admin
        if ($admin) {
            $notification->users()->attach($admin->id, [
                'message' => "Le paiement de {$amount} DH pour le rendez-vous #{$rendezvous->id} a été supprimé"
            ]);
        }

        return response()->json(['message' => 'Payment deleted successfully']);
    }

    use ExcelExportImport;

    public function export()
    {
        return $this->exportExcel(PaymentExport::class, 'payments.xlsx', null);
    }
}
