<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

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
                // Create the controller as a resource controller
                Artisan::call('make:controller', [
                    'name' => $controllerName,
                    '--resource' => true,
                ]);
                $this->info("Resource controller created: $controllerName");
            } else {
                $this->info("Controller already exists: $controllerName");
            }
        }
    }
})->purpose('Create missing resource controllers based on migrations'); 