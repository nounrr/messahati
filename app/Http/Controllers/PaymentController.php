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
//store
    public function store(Request $request)
{
    $validated = $request->validate([
        'payments.*.rendez_vous_id' => 'required|exists:rendez_vouss,id',
        'payments.*.montant' => 'required|numeric',
        'payments.*.date' => 'required|date',
        'payments.*.status' => 'required'
    ]);

    $createdItems = [];
    foreach ($validated['payments'] as $data) {
        
        $createdItems[] = Payment::create($data);
    }

    return response()->json($createdItems, 201);
}

//show
    public function show($id)
    {
        $payment = Payment::findOrFail($id);
        return response()->json($payment);
    }
//edit
    public function edit($id)
    {
        $payment = Payment::findOrFail($id);
        return view('payments.edit', compact('payment'));
    }
//update
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
        $item = Payment::findOrFail($data['id']);
        
        $item->update($data);
        $updatedItems[] = $item;
    }

    return response()->json($updatedItems, 200);
}

    public function destroy($id)
    {
        $payment = Payment::findOrFail($id);
        $payment->delete();

        return redirect()->route('payments.index')->with('success', 'Payment deleted successfully.');
    }
}
