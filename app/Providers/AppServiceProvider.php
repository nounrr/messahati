<?php

namespace App\Providers;

use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // ...existing code...
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Définit la longueur par défaut des chaînes pour éviter les erreurs de migration
        Schema::defaultStringLength(191);
    }
}
