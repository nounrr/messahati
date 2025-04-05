<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;




Route::get('/AccesDenied', function () {return Inertia::render('AccesDenied/AccesDenied');});
Route::get('/popup', function () {return Inertia::render('Home');});
Route::get('/home', function () {return Inertia::render('Components/Popup/Departement');});
Route::get('/Bienvenue', function () {return Inertia::render('Bienvenue/Bienvenue');});
Route::get('/AddInfo', function () {return Inertia::render('Bienvenue/AddInfo');});
Route::get('/Departement', function () {return Inertia::render('Bienvenue/Departement');});
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
