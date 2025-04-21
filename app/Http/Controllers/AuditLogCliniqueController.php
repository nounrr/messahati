<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AuditLogClinique;
use App\Exports\AuditLogCliniqueExport;
use App\Traits\ExcelExportImport;

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
        $validated = $request->validate([
            'audit_log_clinique.*.user_id' => 'required|exists:users,id',
            'audit_log_clinique.*.action' => 'required|string',
            'audit_log_clinique.*.date' => 'required|date'
        ]);

        $createdItems = [];

        foreach ($validated['audit_log_clinique'] as $data) {
            $item = new AuditLogClinique();
            $item->user_id = $data['user_id'];
            $item->action = $data['action'];
            $item->date = $data['date'];
            $item->save();

            $createdItems[] = $item;
        }

        return response()->json($createdItems, 201);
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

    public function update(Request $request)
    {
        $validated = $request->validate([
            'updates' => 'required|array',
            'updates.*.id' => 'required|exists:audit_log_clinique,id',
            'updates.*.user_id' => 'required|exists:users,id',
            'updates.*.action' => 'required|string',
            'updates.*.date' => 'required|date'
        ]);

        $updatedItems = [];

        foreach ($validated['updates'] as $data) {
            $item = AuditLogClinique::findOrFail($data['id']);
            $item->user_id = $data['user_id'];
            $item->action = $data['action'];
            $item->date = $data['date'];
            $item->save();

            $updatedItems[] = $item;
        }

        return response()->json($updatedItems, 200);
    }

    public function destroy($id)
    {
        $auditLog = AuditLogClinique::findOrFail($id);
        $auditLog->delete();

        return redirect()->route('audit_logs.index')->with('success', 'Audit log supprimé avec succès.');
    }

    use ExcelExportImport;

    public function export()
    {
        return $this->exportExcel(AuditLogCliniqueExport::class, 'audit_logs.xlsx', null);
    }
}
