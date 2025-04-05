<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DepartementController;
use App\Http\Controllers\PartenaireController;
use App\Http\Controllers\TypePartenaireController;
use App\Http\Controllers\CliniqueController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\TraitementsController;
use App\Http\Controllers\TypeTraitementController;
use App\Http\Controllers\OrdonanceController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\RendezVousController;

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

Route::resource('departements', DepartementController::class);
Route::resource('partenaires', PartenaireController::class);
Route::resource('type-partenaires', TypePartenaireController::class);
Route::resource('cliniques', CliniqueController::class);
Route::resource('services', ServiceController::class);
Route::resource('traitements', TraitementsController::class);
Route::resource('type-traitements', TypeTraitementController::class);
Route::resource('ordonances', OrdonanceController::class);
Route::resource('payments', PaymentController::class);
Route::resource('rendezvous', RendezVousController::class);

require __DIR__.'/auth.php';
