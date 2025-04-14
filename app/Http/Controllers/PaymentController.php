<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Payment;

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
            'payments.*.rendez_vous_id' => 'required|exists:rendez_vouss,id',
            'payments.*.montant' => 'required|numeric',
            'payments.*.date' => 'required|date',
            'payments.*.status' => 'required'
        ]);

        $createdItems = [];

        foreach ($validated['payments'] as $data) {
            $payment = new Payment();
            $payment->rendez_vous_id = $data['rendez_vous_id'];
            $payment->montant = $data['montant'];
            $payment->date = $data['date'];
            $payment->status = $data['status'];
            $payment->save();

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
            'updates.*.rendez_vous_id' => 'required|exists:rendez_vouss,id',
            'updates.*.montant' => 'required|numeric',
            'updates.*.date' => 'required|date',
            'updates.*.status' => 'required'
        ]);

        $updatedItems = [];

        foreach ($validated['updates'] as $data) {
            $payment = Payment::findOrFail($data['id']);
            $payment->rendez_vous_id = $data['rendez_vous_id'];
            $payment->montant = $data['montant'];
            $payment->date = $data['date'];
            $payment->status = $data['status'];
            $payment->save();

            $updatedItems[] = $payment;
        }

        return response()->json($updatedItems, 200);
    }

    // Supprime un paiement
    public function destroy($id)
    {
        $payment = Payment::findOrFail($id);
        $payment->delete();

        return redirect()->route('payments.index')->with('success', 'Paiement supprimé avec succès.');
    }
}
