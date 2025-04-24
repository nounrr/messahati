<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;

class RolePermissionController extends Controller
{
    public function roles()
    {
        $roles = Role::with('permissions')->get();
        return response()->json($roles);
    }

    public function permissions()
    {
        return response()->json(Permission::all());
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:roles,name',
            'description' => 'nullable|string',
            'status' => 'required|in:active,inactive',
        ]);

        $role = Role::create([
            'name' => $request->name,
            'description' => $request->description,
            'status' => $request->status,
        ]);

        return response()->json(['message' => 'Role created successfully.', 'role' => $role], 201);
    }

    public function update(Request $request, $id)
    {
        $role = Role::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255|unique:roles,name,' . $id,
            'description' => 'nullable|string',
            'status' => 'required|in:active,inactive',
        ]);

        $role->update([
            'name' => $request->name,
            'description' => $request->description,
            'status' => $request->status,
        ]);

        return response()->json(['message' => 'Role updated successfully.', 'role' => $role]);
    }

    public function destroy($id)
    {
        $role = Role::findOrFail($id);
        $role->delete();

        return response()->json(['message' => 'Role deleted successfully.']);
    }

    public function updateRolePermissions($id, Request $request)
    {
        $role = Role::findOrFail($id);
        
        // Valider les permissions
        $request->validate([
            'permissions' => 'required|array',
            'permissions.*' => 'exists:permissions,id',
        ]);
        
        // Récupérer les ID des permissions
        $permissionIds = $request->permissions;
        
        // Récupérer les objets Permission depuis les IDs
        $permissions = Permission::whereIn('id', $permissionIds)->get();
        
        // Attribuer les permissions au rôle (cela remplace toutes les permissions existantes)
        $role->syncPermissions($permissions);
        
        return response()->json([
            'message' => 'Role permissions updated successfully.',
            'role' => $role->load('permissions')
        ]);
    }

    public function assignRoleToUser(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'role' => 'required|exists:roles,name',
        ]);

        $user = User::findOrFail($request->user_id);
        $user->assignRole($request->role);

        return response()->json(['message' => 'Role assigned successfully.']);
    }

    public function assignPermissionToUser(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'permission' => 'required|exists:permissions,name',
        ]);

        $user = User::findOrFail($request->user_id);
        $user->givePermissionTo($request->permission);

        return response()->json(['message' => 'Permission assigned successfully.']);
    }

    public function userPermissions($id)
    {
        $user = User::with('permissions')->findOrFail($id);
    
        return response()->json([
            'user' => $user->name,
            'permissions' => $user->getAllPermissions(), // inclut permissions via rôles et directes
        ]);
    }
    
}
        