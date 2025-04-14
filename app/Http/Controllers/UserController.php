<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;

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
} 