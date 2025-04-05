<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Payment;

class PaymentController extends Controller
{
    public function index()
    {
        $payments = Payment::all();
        return response()->json($payments);
    }

    public function create()
    {
        return view('payments.create');
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'payments' => 'required|array',
            'payments.*.montant' => 'required|numeric',
            'payments.*.date' => 'required|date',
            'payments.*.description' => 'nullable|string',
        ]);

        foreach ($validatedData['payments'] as $data) {
            Payment::create($data);
        }

        return response()->json(['message' => 'Paiements créés avec succès.']);
    }

    public function show(string $id)
    {
        $payment = Payment::findOrFail($id);
        return response()->json($payment);
    }

    public function edit(string $id)
    {
        $payment = Payment::findOrFail($id);
        return view('payments.edit', compact('payment'));
    }

    public function update(Request $request, string $id = null)
    {
        $validatedData = $request->validate([
            'payments' => 'required|array',
            'payments.*.id' => 'required|exists:payments,id',
            'payments.*.montant' => 'required|numeric',
            'payments.*.date' => 'required|date',
            'payments.*.description' => 'nullable|string',
        ]);

        foreach ($validatedData['payments'] as $data) {
            $payment = Payment::find($data['id']);
            $payment->update($data);
        }

        return response()->json(['message' => 'Paiements mis à jour avec succès.']);
    }

    public function destroy(Request $request, string $id = null)
    {
        if ($id) {
            $payment = Payment::findOrFail($id);
            $payment->delete();
        } else {
            $validatedData = $request->validate([
                'ids' => 'required|array',
                'ids.*' => 'required|exists:payments,id',
            ]);

            Payment::whereIn('id', $validatedData['ids'])->delete();
        }

        return response()->json(['message' => 'Paiements supprimés avec succès.']);
    }
}
