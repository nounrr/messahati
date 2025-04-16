<?php
use App\Http\Controllers\Api\ChatController;

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DepartementController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\RolePermissionController;
use App\Http\Controllers\ReclamationController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\MutuelController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

// Routes publiques
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Routes d'authentification
Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

// Dashboard
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->name('dashboard');

// Pages Inertia
Route::get('/typeTraitement', function () {
    return Inertia::render('Components/Forms/TypeTraitement');
});
Route::get('/AccesDenied', function () {
    return Inertia::render('AccesDenied/AccesDenied');
});
Route::get('/popup', function () {
    return Inertia::render('Home');
});
Route::get('/home', function () {
    return Inertia::render('Components/Popup/Departement');
});
Route::get('/Bienvenue', function () {
    return Inertia::render('Bienvenue/Bienvenue');
});
Route::get('/AddInfo', function () {
    return Inertia::render('Bienvenue/AddInfo');
});
Route::get('/Departement', function () {
    return Inertia::render('Components/Popup/Departement');
});

// Routes pour les départements
Route::get('/export', [DepartementController::class, 'export'])->name('departements.export');

// Routes pour les réclamations, feedbacks et mutuels
Route::resource('reclamation', ReclamationController::class);
Route::resource('feedback', FeedbackController::class);
Route::resource('mutuel', MutuelController::class);

// Routes pour les vues des rôles et permissions
Route::get('/roles', function () {
    return Inertia::render('Components/RoleAccessLayer');
})->name('roles.view');

Route::get('/assign-roles', function () {
    return Inertia::render('Components/AssignRoleLayer');
})->name('assign-roles.view');

// Routes pour l'attribution des rôles (vues)
Route::get('/assign-role', [RoleController::class, 'index'])->name('roles.assign');

// Route pour les rôles et permissions
Route::get('/role-permissions', [RolePermissionController::class, 'roles'])->name('role.permissions');

Route::post('/send-message', [ChatController::class, 'send']);
// Route::get('/messages/{user_id}', [ChatController::class, 'getMessages']);
Route::get('/messages/sent/{user_id}', [ChatController::class, 'getSentMessages']);
Route::get('/messages/received/{user_id}', [ChatController::class, 'getReceivedMessages']);

// Route pour accéder à la vue du chat
Route::get('/chat', function () {
    return Inertia::render('Components/Chat/ChatMessageLayer');
})->name('chat.view');

// Route::post('/send-data', [App\Http\Controllers\RealTimeController::class, 'sendData']);

require __DIR__.'/auth.php';
