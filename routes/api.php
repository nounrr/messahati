<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\RolePermissionController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\Api\ChatController;
use App\Http\Controllers\TypePartenaireController;
use App\Http\Controllers\TypeTraitementController;
use App\Http\Controllers\TypeMedicamentController;
use App\Http\Controllers\TypeCertificatController;
use App\Http\Controllers\DepartementController;
use App\Http\Controllers\CliniqueController;
use App\Http\Controllers\TraitementController;
use App\Http\Controllers\TachController;
use App\Http\Controllers\SalaireController;
use App\Http\Controllers\RendezVousController;
use App\Http\Controllers\ReclamationController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PartenaireController;
use App\Http\Controllers\OrdonanceController;
use App\Http\Controllers\MedicamentController;
use App\Http\Controllers\MutuelController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\ChargeController;
use App\Http\Controllers\CertificatsMedicaleController;
use App\Http\Controllers\AuditLogCliniqueController;
use App\Http\Controllers\AttachementController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\ModelPermissionController;

// Route for importing partenaires
Route::post('/partenaires/import', [PartenaireController::class, 'import'])->name('partenaires.import');
Route::post('/departements/import', [DepartementController::class, 'import'])->name('departements.import');
Route::post('/type-traitements/import', [TypeTraitementController::class, 'import'])->name('type_traitements.import');


Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    $user = $request->user()->load('roles');
    return $user;
});


// Routes d'authentification
Route::post('/login', [AuthenticatedSessionController::class, 'store']);

// Routes pour les utilisateurs
Route::get('/users', [UserController::class, 'index']);
Route::get('/users/role/{role}', [UserController::class, 'getUsersByRole']);
Route::get('/roles', [UserController::class, 'getRoles']);

// Routes pour les départements

Route::delete('/departements/bulk', [DepartementController::class, 'destroy'])->name('departements.destroy.multiple');
Route::resource('departements', DepartementController::class);

// ROUTE CHarges done
Route::apiResource('charges', ChargeController::class)   
     ->except(['create', 'edit', 'show']);               
Route::put   ('charges', [ChargeController::class, 'update']);   
Route::delete('charges', [ChargeController::class, 'destroy']);  
// Routes pour les cliniques
Route::resource('cliniques', CliniqueController::class);

// Routes pour les types de traitements
Route::resource('type-traitements', TypeTraitementController::class);

// Routes pour les types de certificats
Route::resource('type-certificats', TypeCertificatController::class);

// Routes pour les types de médicaments Done
Route::resource('type-medicaments', TypeMedicamentController::class);

// Routes pour les types de partenaires DONE
Route::resource('type-partenaires', TypePartenaireController::class);

// Routes pour les traitements
Route::resource('traitements', TraitementController::class);

// Routes pour les tâches
Route::resource('taches', TachController::class);

// Routes pour les salaires Done
Route::resource('salaires', SalaireController::class) ->except(['create', 'edit', 'show']);               
Route::put   ('salaires', [SalaireController::class, 'update']);   
Route::delete('salaires', [SalaireController::class, 'destroy']);  

// Routes pour les rendez-vous
Route::resource('rendez-vous', RendezVousController::class);

// Routes pour les réclamations - protégées par auth:sanctum
// routes/api.php

Route::resource('reclamations', ReclamationController::class);
Route::delete('/reclamations', [ReclamationController::class, 'destroy'])->name('reclamations.destroy.multiple');

// Routes pour les paiements
Route::resource('payments', PaymentController::class);

// Routes pour les partenaires
Route::resource('partenaires', PartenaireController::class);
Route::delete('/partenaires', [PartenaireController::class, 'destroy'])->name('partenaires.destroy.multiple');

// Routes pour les ordonnances
Route::resource('ordonances', OrdonanceController::class);

// Routes pour les médicaments
Route::resource('medicaments', MedicamentController::class);

// Routes pour les mutuels Done
Route::apiResource('mutuels', MutuelController::class)
     ->except(['create', 'edit']);
Route::delete('mutuels', [MutuelController::class, 'destroy']);

// Routes pour les notifications
Route::resource('notifications', NotificationController::class);

// Routes pour les messages
Route::resource('messages', MessageController::class);

// Routes pour les certificats médicaux
Route::resource('certificats-medicaux', CertificatsMedicaleController::class);

// Routes pour les logs d'audit des cliniques
Route::resource('audit-log-cliniques', AuditLogCliniqueController::class);

// Routes pour les pièces jointes
Route::resource('attachements', AttachementController::class);

// Routes pour les retours d'expérience
Route::resource('feedbacks', FeedbackController::class);

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

// Routes API pour les model_has_permissions
Route::prefix('model-permissions')->group(function () {
    Route::get('/', [ModelPermissionController::class, 'index'])->name('api.model-permissions.index');
    Route::get('/user/{userId}', [ModelPermissionController::class, 'getUserPermissions'])->name('api.model-permissions.user');
    Route::post('/', [ModelPermissionController::class, 'store'])->name('api.model-permissions.store');
    Route::delete('/', [ModelPermissionController::class, 'destroy'])->name('api.model-permissions.destroy');
    Route::delete('/bulk', [ModelPermissionController::class, 'bulkDestroy'])->name('api.model-permissions.bulk-destroy');
});
