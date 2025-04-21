<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class ModelHasPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Ajoute des enregistrements à la table model_has_permissions pour attribuer des permissions aux utilisateurs
     */
    public function run(): void
    {
        // Vider la table avant d'ajouter de nouvelles données en désactivant temporairement les contraintes
        Schema::disableForeignKeyConstraints();
        DB::table('model_has_permissions')->delete();
        Schema::enableForeignKeyConstraints();
        
        $permissionIds = range(1, 31); // IDs des permissions (1 à 31)
        $userIds = range(2, 26); // IDs des utilisateurs (2 à 26)
        
        $modelHasPermissions = [];
        
        // Attribuer aléatoirement des permissions aux utilisateurs
        foreach ($userIds as $userId) {
            // Chaque utilisateur obtient entre 3 et 10 permissions aléatoires
            $numPermissions = rand(3, 10);
            $randomPermissions = array_rand(array_flip($permissionIds), $numPermissions);
            
            if (!is_array($randomPermissions)) {
                $randomPermissions = [$randomPermissions];
            }
            
            foreach ($randomPermissions as $permissionId) {
                $modelHasPermissions[] = [
                    'permission_id' => $permissionId,
                    'model_type' => 'App\\Models\\User',
                    'model_id' => $userId,
                ];
            }
        }
        
        // Insérer toutes les attributions en une seule opération
        DB::table('model_has_permissions')->insert($modelHasPermissions);
        
        // Message de confirmation
        $this->command->info('Permissions attribuées aux utilisateurs avec succès !');
    }
}
