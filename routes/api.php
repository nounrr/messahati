<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\RolePermissionController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\Api\ChatController;
use App\Http\Controllers\TypePartenaireController;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user(); // Retourne l'utilisateur authentifié
});

// Routes d'authentification
Route::post('/login', [AuthenticatedSessionController::class, 'store']);

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
Route::get('/user-permissions/{id}', [RolePermissionController::class, 'userPermissions'])->name('api.user.permissions');

Route::post('/send-message', [ChatController::class, 'send']);
// Route::get('/messages/{user_id}', [ChatController::class, 'getMessages']);
Route::get('/messages/sent/{user_id}', [ChatController::class, 'getSentMessages']);
Route::get('/messages/received/{user_id}', [ChatController::class, 'getReceivedMessages']);

// Route::post('/send-data', [App\Http\Controllers\RealTimeController::class, 'sendData']);
