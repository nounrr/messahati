<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use App\Exports\UserExport;
use App\Traits\ExcelExportImport;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Get all users with their roles
     */
    public function index()
    {
        $users = User::with(['roles', 'departement'])->get();
        return response()->json($users);
    }

    /**
     * Get users by role
     */
    public function getUsersByRole($role)
    {
        $users = User::role($role)->with(['roles', 'departement'])->get();
        return response()->json($users);
    }

    /**
     * Get all available roles
     */
    public function getRoles()
    {
        $roles = Role::all();
        return response()->json($roles);
    }

    /**
     * Store a new user
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'users' => 'required|array',
            'users.*.name' => 'required|string|max:255',
            'users.*.prenom' => 'required|string|max:255',
            'users.*.cin' => 'required|string|unique:users,cin',
            'users.*.email' => 'required|string|email|max:255|unique:users,email',
            'users.*.password' => 'required|string|min:8',
            'users.*.telephone' => 'required|string',
            'users.*.adresse' => 'required|string',
            'users.*.departement_id' => 'required|exists:departements,id',
            'users.*.role' => 'required|string|exists:roles,name',
            'users.*.status' => 'required|string',
        ]);

        $createdUsers = [];
        foreach ($validated['users'] as $userData) {
            $user = User::create([
                'name' => $userData['name'],
                'prenom' => $userData['prenom'],
                'cin' => $userData['cin'],
                'email' => $userData['email'],
                'password' => Hash::make($userData['password']),
                'telephone' => $userData['telephone'],
                'adresse' => $userData['adresse'],
                'departement_id' => $userData['departement_id'],
                'status' => $userData['status'], 
            ]);

            // Assigner le rôle
            $user->assignRole($userData['role']);

            // Charger le rôle assigné
            $user->load('roles');
            $createdUsers[] = $user;
        }

        return response()->json($createdUsers);
    }

    /**
     * Update user(s)
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'users' => 'required|array',
            'users.*.id' => 'required|exists:users,id',
            'users.*.name' => 'required|string|max:255',
            'users.*.prenom' => 'required|string|max:255',
            'users.*.email' => 'required|string|email|max:255',
            'users.*.telephone' => 'required|string',
            'users.*.adresse' => 'required|string',
            'users.*.departement_id' => 'required|exists:departements,id',
            'users.*.role' => 'required|string|exists:roles,name',
            'users.*.password' => 'nullable|string|min:8',
            'users.*.status' => 'required|string',
        ]);

        $updatedUsers = [];
        foreach ($validated['users'] as $userData) {
            $user = User::find($userData['id']);

            $user->update([
                'name' => $userData['name'],
                'prenom' => $userData['prenom'],
                'email' => $userData['email'],
                'telephone' => $userData['telephone'],
                'adresse' => $userData['adresse'],
                'departement_id' => $userData['departement_id'],
                'status' => $userData['status'],
            ]);

            // Mettre à jour le mot de passe si fourni
            if (!empty($userData['password'])) {
                $user->update([
                    'password' => Hash::make($userData['password']),
                ]);
            }

            // Synchroniser le rôle
            $user->syncRoles([$userData['role']]);

            // Charger le rôle assigné
            $user->load('roles');
            $updatedUsers[] = $user;
        }

        return response()->json($updatedUsers);
    }

    /**
     * Delete user(s)
     */
    public function destroy(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'required|exists:users,id'
        ]);

        User::whereIn('id', $request->ids)->delete();

        return response()->json(['ids' => $request->ids]);
    }

    use ExcelExportImport;

    public function export()
    {
        return $this->exportExcel(UserExport::class, 'users.xlsx', null);
    }
} 