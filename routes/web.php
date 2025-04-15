<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});
// use App\Http\Controllers\RoleController;


// Route::get('/roles', [RoleController::class, 'index'])->name('roles.index');
// Route::post('/roles/assign/{user}', [RoleController::class, 'assign'])->name('roles.assign');
// Route::post('/roles/remove', [RoleController::class, 'removeRole'])->name('roles.remove');
use App\Http\Controllers\RoleController;

Route::get('/assign-roles', [RoleController::class, 'index'])->name('assign.index');
Route::post('/assign-role/{userId}', [RoleController::class, 'assign'])->name('assign.role');
Route::post('/remove-role', [RoleController::class, 'removeRole'])->name('remove.role');



// // ✅ Route protégée par rôle
// Route::middleware(['role:admin'])->get('/admin/dashboard', function () {
//     return "Bienvenue, Admin";
// });

// // ✅ Route protégée par permission
// Route::middleware(['permission:edit articles'])->get('/articles/edit', function () {
//     return "Vous pouvez modifier des articles";
// });

// // ✅ Plusieurs rôles
// Route::middleware(['role:admin,manager'])->get('/management', function () {
//     return "Bienvenue, Admin ou Manager";
// });

// // ✅ Plusieurs permissions
// Route::middleware(['permission:edit articles,delete articles'])->get('/articles/manage', function () {
//     return "Vous pouvez modifier et supprimer des articles";
// });
Route::middleware(['role:admin,manager'])->get('/assign-role', [RoleController::class, 'index'])->name('roles.assign');
Route::middleware(['role:admin,manager'])->post('/assign-role', [RoleController::class, 'assignRole']);
Route::middleware(['role:admin,manager'])->post('/remove-role', [RoleController::class, 'removeRole'])->name('roles.remove');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});




require __DIR__.'/auth.php';
