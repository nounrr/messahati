<?php
    {namespace App\Http\Controllers\Api;

        use App\Http\Controllers\Controller;
        use Illuminate\Http\Request;
        use Spatie\Permission\Models\Role;
        use Spatie\Permission\Models\Permission;
        use App\Models\User;
        
        class RolePermissionController extends Controller
        {
            public function roles()
            {
                return response()->json(Role::all());
            }
        
            public function permissions()
            {
                return response()->json(Permission::all());
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
        }
        