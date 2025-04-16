<?php

use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

Artisan::command('make:missing-controllers', function () {
    $migrationPath = database_path('migrations');
    $controllerPath = app_path('Http/Controllers');

    // Get all migration files
    $migrationFiles = File::files($migrationPath);

    foreach ($migrationFiles as $file) {
        $content = File::get($file);
        if (preg_match('/Schema::create\(\'([a-zA-Z0-9_]+)\'/', $content, $matches)) {
            $tableName = $matches[1];
            $controllerName = Str::studly(Str::singular($tableName)) . 'Controller';

            $controllerFile = $controllerPath . '/' . $controllerName . '.php';
            if (!File::exists($controllerFile)) {
                // Create the controller
                Artisan::call('make:controller', ['name' => $controllerName]);
                $this->info("Controller created: $controllerName");
            } else {
                $this->info("Controller already exists: $controllerName");
            }
        }
    }
})->describe('Create missing controllers based on migrations');
