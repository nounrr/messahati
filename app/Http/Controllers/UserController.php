<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use App\Exports\UserExport;
use App\Traits\ExcelExportImport;

class UserController extends Controller
{
    /**
     * Get all users with their roles
     */
    public function index()
    {
        $users = User::with(['roles', 'departement'])->get();
        
        // Ajouter le rôle principal à chaque utilisateur
        $users->each(function ($user) {
            $user->role = $user->getRoleAttribute();
        });
        
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

    use ExcelExportImport;

    public function export()
    {
        return $this->exportExcel(UserExport::class, 'users.xlsx', null);
    }

} 