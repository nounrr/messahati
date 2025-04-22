<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use App\Exports\UserExport;
use App\Traits\ExcelExportImport;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{
    /**
     * Get all users with their roles
     */
    public function index()
    {
        $users = User::with('roles')->get();
        return response()->json($users);
    }

    /**
     * Get users by role
     */
    public function getUsersByRole($role)
    {
        $users = User::role($role)->with('roles')->get();
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
     * Update user information
     */
    public function update(Request $request)
    {
        $users = json_decode($request->input('users'), true);
        
        $validated = $request->validate([
            'users' => 'required|string',
            'users.*.id' => 'required|exists:users,id',
            'users.*.name' => 'required|string|max:255',
            'users.*.email' => 'required|email|max:255',
            'users.*.telephone' => 'nullable|string|max:20',
            'users.*.photo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048'
        ]);

        $updatedUsers = [];

        foreach ($users as $userData) {
            $user = User::findOrFail($userData['id']);
            
            // Mettre à jour les champs de base
            $user->name = $userData['name'];
            $user->email = $userData['email'];
            $user->telephone = $userData['telephone'];

            // Gérer l'upload de photo si présent
            if ($request->hasFile('users.0.photo')) {
                $path = $request->file('users.0.photo')->store('public/users');
                $user->img_path = str_replace('public/', '', $path);
            }

            $user->save();
            $updatedUsers[] = $user;
        }

        return response()->json($updatedUsers);
    }

    /**
     * Change user password
     */
    public function changePassword(Request $request)
    {
        try {
            // Vérifier si l'utilisateur est authentifié
            if (!auth()->check()) {
                Log::warning('Tentative de changement de mot de passe sans authentification');
                return response()->json([
                    'success' => false,
                    'message' => 'Utilisateur non authentifié'
                ], 401);
            }

            // Valider les données
            $validated = $request->validate([
                'current_password' => 'required|string',
                'new_password' => 'required|string|min:8',
                'confirm_password' => 'required|string|same:new_password'
            ]);

            // Récupérer l'utilisateur
            $user = auth()->user();
            Log::info('Tentative de changement de mot de passe pour l\'utilisateur: ' . $user->id);

            // Vérifier le mot de passe actuel
            if (!Hash::check($validated['current_password'], $user->password)) {
                Log::warning('Mot de passe actuel incorrect pour l\'utilisateur: ' . $user->id);
                return response()->json([
                    'success' => false,
                    'message' => 'Le mot de passe actuel est incorrect'
                ], 422);
            }

            // Changer le mot de passe
            $user->password = Hash::make($validated['new_password']);
            $user->save();

            Log::info('Mot de passe changé avec succès pour l\'utilisateur: ' . $user->id);

            return response()->json([
                'success' => true,
                'message' => 'Le mot de passe a été changé avec succès',
                'user' => $user
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur lors du changement de mot de passe: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Une erreur est survenue lors du changement de mot de passe'
            ], 500);
        }
    }

    use ExcelExportImport;

    public function export()
    {
        return $this->exportExcel(UserExport::class, 'users.xlsx', null);
    }
} 