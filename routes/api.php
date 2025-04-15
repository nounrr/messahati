<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\AttachementController;
use App\Http\Controllers\AuditLogCliniqueController;
use App\Http\Controllers\CertificatsMedicaleController;
use App\Http\Controllers\ChargeController;
use App\Http\Controllers\CliniqueController;
use App\Http\Controllers\DepartementController;
use App\Http\Controllers\feedbackController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\MedicamentController;
use App\Http\Controllers\MutuelController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\OrdonanceController;
use App\Http\Controllers\PartenaireController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\RendezVousController;
use App\Http\Controllers\ReclamationController;
use App\Http\Controllers\SalaireController;
use App\Http\Controllers\TachController;
use App\Http\Controllers\TraitementController;
use App\Http\Controllers\TypeCertificatController;
use App\Http\Controllers\TypeMedicamentController;
use App\Http\Controllers\TypePartenaireController;
use App\Http\Controllers\TypeTraitementController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RolePermissionController;
use App\Http\Controllers\RoleController;

// Route pour obtenir l'utilisateur authentifié
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Routes d'authentification
Route::post('/login', [LoginController::class, 'login']);

// Routes pour les utilisateurs
Route::get('/users', [UserController::class, 'index']);
Route::get('/users/role/{role}', [UserController::class, 'getUsersByRole']);
Route::get('/roles', [UserController::class, 'getRoles']);

// Routes pour les départements
Route::resource('departements', DepartementController::class);

// Routes pour les cliniques
Route::resource('cliniques', CliniqueController::class);

// Routes pour les types de traitements
Route::resource('type-traitements', TypeTraitementController::class);

// Routes pour les types de certificats
Route::resource('type-certificats', TypeCertificatController::class);

// Routes pour les types de médicaments
Route::resource('type-medicaments', TypeMedicamentController::class);

// Routes pour les types de partenaires
Route::resource('type-partenaires', TypePartenaireController::class);

// Routes pour les traitements
Route::resource('traitements', TraitementController::class);

// Routes pour les tâches
Route::resource('taches', TachController::class);

// Routes pour les salaires
Route::resource('salaires', SalaireController::class);

// Routes pour les rendez-vous
Route::resource('rendez-vous', RendezVousController::class);

// Routes pour les réclamations
Route::resource('reclamations', ReclamationController::class);

// Routes pour les paiements
Route::resource('payments', PaymentController::class);

// Routes pour les partenaires
Route::resource('partenaires', PartenaireController::class);

// Routes pour les ordonnances
Route::resource('ordonances', OrdonanceController::class);

// Routes pour les médicaments
Route::resource('medicaments', MedicamentController::class);

// Routes pour les mutuels
Route::resource('mutuels', MutuelController::class);

// Routes pour les notifications
Route::resource('notifications', NotificationController::class);

// Routes pour les messages
Route::resource('messages', MessageController::class);

// Routes pour les charges
Route::resource('charges', ChargeController::class);

// Routes pour les certificats médicaux
Route::resource('certificats-medicaux', CertificatsMedicaleController::class);

// Routes pour les logs d'audit des cliniques
Route::resource('audit-log-cliniques', AuditLogCliniqueController::class);

// Routes pour les pièces jointes
Route::resource('attachements', AttachementController::class);

// Routes pour les retours d'expérience
Route::resource('feedbacks', feedbackController::class);

// Routes API pour les rôles et permissions
Route::prefix('roles')->group(function () {
    // Routes pour les rôles
    Route::get('/', [RolePermissionController::class, 'roles'])->name('api.roles.index');
    Route::post('/', [RolePermissionController::class, 'store'])->name('api.roles.store');
    Route::put('/{id}', [RolePermissionController::class, 'update'])->name('api.roles.update');
    Route::delete('/{id}', [RolePermissionController::class, 'destroy'])->name('api.roles.destroy');
});

Route::prefix('permissions')->group(function () {
    // Routes pour les permissions
    Route::get('/', [RolePermissionController::class, 'permissions'])->name('api.permissions.index');
});

// Routes pour l'attribution des rôles et permissions
Route::post('/assign-role', [RolePermissionController::class, 'assignRoleToUser'])->name('api.roles.assign');
Route::post('/assign-permission', [RolePermissionController::class, 'assignPermissionToUser'])->name('api.permissions.assign');
Route::post('/remove-role', [RoleController::class, 'removeRole'])->name('api.roles.remove');
Route::post('/assign-role/{userId}', [RoleController::class, 'assign'])->name('api.assign.role');
