<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AuditLogClinique;

class AuditLogCliniqueController extends Controller
{
    public function index()
    {
        $auditLogs = AuditLogClinique::all();
        return response()->json($auditLogs);
    }

    public function create()
    {
        return view('audit_logs.create');
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'action' => 'required|string|max:255',
            'description' => 'nullable|string',
            'user_id' => 'required|exists:users,id',
            'clinique_id' => 'required|exists:cliniques,id',
            'date' => 'required|date',
        ]);

        AuditLogClinique::create($validatedData);

        return redirect()->route('audit_logs.index')->with('success', 'Audit log créé avec succès.');
    }

    public function show($id)
    {
        $auditLog = AuditLogClinique::findOrFail($id);
        return response()->json($auditLog);
    }

    public function edit($id)
    {
        $auditLog = AuditLogClinique::findOrFail($id);
        return view('audit_logs.edit', compact('auditLog'));
    }

    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'action' => 'required|string|max:255',
            'description' => 'nullable|string',
            'user_id' => 'required|exists:users,id',
            'clinique_id' => 'required|exists:cliniques,id',
            'date' => 'required|date',
        ]);

        $auditLog = AuditLogClinique::findOrFail($id);
        $auditLog->update($validatedData);

        return redirect()->route('audit_logs.index')->with('success', 'Audit log mis à jour avec succès.');
    }

    public function destroy($id)
    {
        $auditLog = AuditLogClinique::findOrFail($id);
        $auditLog->delete();

        return redirect()->route('audit_logs.index')->with('success', 'Audit log supprimé avec succès.');
    }
}
