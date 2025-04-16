<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DepartementController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::get('/export', [DepartementController::class, 'export'])->name('departements.export');


Route::get('/typeTraitement', function () {return Inertia::render('Components/Forms/TypeTraitement');});
Route::get('/AccesDenied', function () {return Inertia::render('AccesDenied/AccesDenied');});
Route::get('/popup', function () {return Inertia::render('Home');});
Route::get('/home', function () {return Inertia::render('Components/Popup/Departement');});
Route::get('/Bienvenue', function () {return Inertia::render('Bienvenue/Bienvenue');});
Route::get('/AddInfo', function () {return Inertia::render('Bienvenue/AddInfo');});
Route::get('/Departement', function () {return Inertia::render('Components/Popup/Departement');});
// Route::get('/Departement', function () {return Inertia::render('Components/DepartementCreate');});
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
use App\Http\Controllers\ReclamationController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\MutuelController;

Route::resource('reclamation', ReclamationController::class);
Route::resource('feedback', feedbackController::class);
Route::resource('mutuel', MutuelController::class);


// Routes pour la gestion des rôles et permissions

    // Routes pour les rôles
    Route::get('/roles', [App\Http\Controllers\RolePermissionController::class, 'roles'])->name('roles.index');
    Route::post('/roles', [App\Http\Controllers\RolePermissionController::class, 'store'])->name('roles.store');
    Route::put('/roles/{id}', [App\Http\Controllers\RolePermissionController::class, 'update'])->name('roles.update');
    Route::delete('/roles/{id}', [App\Http\Controllers\RolePermissionController::class, 'destroy'])->name('roles.destroy');
    
    // Routes pour les permissions
    Route::get('/permissions', [App\Http\Controllers\RolePermissionController::class, 'permissions'])->name('permissions.index');
    
    // Routes pour l'attribution des rôles et permissions
    Route::post('/assign-role', [App\Http\Controllers\RolePermissionController::class, 'assignRoleToUser'])->name('roles.assign');
    Route::post('/assign-permission', [App\Http\Controllers\RolePermissionController::class, 'assignPermissionToUser'])->name('permissions.assign');
    Route::post('/remove-role', [App\Http\Controllers\RoleController::class, 'removeRole'])->name('roles.remove');




require __DIR__.'/auth.php';
