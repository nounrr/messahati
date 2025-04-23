<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions if they don't exist
        $permissions = [
            'create user', 'edit user', 'delete user', 'view user',
            'create patient', 'edit patient', 'delete patient', 'view patient',
            'create appointment', 'edit appointment', 'delete appointment', 'view appointment',
            'create consultation', 'edit consultation', 'delete consultation', 'view consultation',
            'create medical record', 'edit medical record', 'delete medical record', 'view medical record',
            'create prescription', 'edit prescription', 'delete prescription', 'view prescription',
            'create invoice', 'edit invoice', 'delete invoice', 'view invoice',
            'generate financial reports', 'view financial reports',
            'manage settings', 'view settings',
            'manage roles', 'view roles',
            'manage permissions', 'view permissions'
        ];

        foreach ($permissions as $permission) {
            if (!Permission::where('name', $permission)->exists()) {
                Permission::create(['name' => $permission, 'guard_name' => 'web']);
            }
        }

        // Create roles and assign permissions
        $roles = [
            'admin' => $permissions,
            'doctor' => [
                'view patient', 'create patient', 'edit patient',
                'view appointment', 'create appointment', 'edit appointment',
                'view consultation', 'create consultation', 'edit consultation',
                'view medical record', 'create medical record', 'edit medical record',
                'view prescription', 'create prescription', 'edit prescription',
                'view invoice', 'create invoice', 'edit invoice',
                'view financial reports'
            ],
            'secretary' => [
                'view patient', 'create patient', 'edit patient',
                'view appointment', 'create appointment', 'edit appointment',
                'view consultation', 'create consultation',
                'view medical record',
                'view prescription',
                'view invoice', 'create invoice',
                'view financial reports'
            ],
            'nurse' => [
                'view patient', 'edit patient',
                'view appointment',
                'view consultation', 'create consultation',
                'view medical record', 'edit medical record',
                'view prescription',
                'view invoice'
            ],
            'accountant' => [
                'view patient',
                'view appointment',
                'view consultation',
                'view medical record',
                'view prescription',
                'view invoice', 'create invoice', 'edit invoice', 'delete invoice',
                'generate financial reports', 'view financial reports'
            ],
            'patient' => [
                'view patient',
                'view appointment',
                'view consultation',
                'view medical record',
                'view prescription',
                'view invoice'
            ]
        ];

        foreach ($roles as $roleName => $rolePermissions) {
            $role = Role::firstOrCreate(['name' => $roleName, 'guard_name' => 'web']);
            $role->syncPermissions($rolePermissions);
        }
    }
}
