<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Commande personnalisée pour créer les contrôleurs manquants en tant que contrôleurs "resource"
Artisan::command('make:missing-controllers', function () {
    $migrationPath = database_path('migrations');
    $controllerPath = app_path('Http/Controllers');

    // Récupération de tous les fichiers de migration
    $migrationFiles = File::files($migrationPath);

    foreach ($migrationFiles as $file) {
        $content = File::get($file);

        // Extraction du nom de la table depuis la migration
        if (preg_match('/Schema::create\(\'([a-zA-Z0-9_]+)\'/', $content, $matches)) {
            $tableName = $matches[1];

            // Construction du nom du contrôleur
            $controllerName = Str::studly(Str::singular($tableName)) . 'Controller';
            $controllerFile = $controllerPath . '/' . $controllerName . '.php';

            // Création du contrôleur s'il n'existe pas déjà
            if (!File::exists($controllerFile)) {
                Artisan::call('make:controller', [
                    'name' => $controllerName,
                    '--resource' => true,
                ]);
                $this->info("✅ Resource controller created: $controllerName");
            } else {
                $this->warn("⚠️ Controller already exists: $controllerName");
            }
        }
    }
})->purpose('Create missing resource controllers based on migrations');
