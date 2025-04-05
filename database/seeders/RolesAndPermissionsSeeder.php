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
        // Réinitialiser les rôles et permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();


        $permissions = [
            
            'create user', 'edit user', 'delete user', 'assign roles',

            
            'create patient', 'edit patient', 'delete patient', 'view patient',

            
            'create appointment', 'edit appointment', 'delete appointment', 'view appointment',

            
            'create consultation', 'edit consultation', 'delete consultation', 'view consultation',

           
            'access medical record', 'edit medical record', 'delete medical record',

            
            'create prescription', 'edit prescription', 'delete prescription', 'view prescription',

            
            'create invoice', 'edit invoice', 'delete invoice', 'view payments', 'manage refunds',

           
            'generate medical reports', 'generate financial reports', 'view statistics',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        
        $admin = Role::create(['name' => 'admin']);
        $admin->givePermissionTo(Permission::all());

        $doctor = Role::create(['name' => 'doctor']);
        $doctor->givePermissionTo([
            'view patient', 'create consultation', 'edit consultation', 'delete consultation',
            'access medical record', 'edit medical record', 'view prescription', 'create prescription', 'edit prescription',
            'generate medical reports'
        ]);

        $secretary = Role::create(['name' => 'secretary']);
        $secretary->givePermissionTo([
            'create patient', 'edit patient', 'view patient',
            'create appointment', 'edit appointment', 'delete appointment', 'view appointment'
        ]);

        $nurse = Role::create(['name' => 'nurse']);
        $nurse->givePermissionTo([
            'view patient', 'access medical record'
        ]);

        $accountant = Role::create(['name' => 'accountant']);
        $accountant->givePermissionTo([
            'create invoice', 'edit invoice', 'delete invoice', 'view payments', 'manage refunds',
            'generate financial reports'
        ]);

        $patient = Role::create(['name' => 'patient']);
        $patient->givePermissionTo([
            'view patient', 'view appointment', 'view prescription', 'view payments'
        ]);
    }
}
