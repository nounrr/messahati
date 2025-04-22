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
use App\Http\Controllers\FactureController;
// Route pour obtenir l'utilisateur authentifié
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

use App\Http\Controllers\Api\ChatController;

Route::post('/send-message', [ChatController::class, 'send']);
// Route::get('/messages/{user_id}', [ChatController::class, 'getMessages']);
Route::get('/messages/sent/{user_id}', [ChatController::class, 'getSentMessages']);
Route::get('/messages/received/{user_id}', [ChatController::class, 'getReceivedMessages']);

// Route::post('/send-data', [App\Http\Controllers\RealTimeController::class, 'sendData']);
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
Route::put('/rendez-vous/update', [RendezVousController::class, 'update']);
Route::delete('/rendez-vous/delete', [RendezVousController::class, 'destroy']);
Route::resource('rendez-vous', RendezVousController::class);

// Routes pour les réclamations
Route::get('/reclamations', [ReclamationController::class, 'index']);
Route::post('/reclamations', [ReclamationController::class, 'store']);
Route::get('/reclamations/{id}', [ReclamationController::class, 'show']);
Route::put('/reclamations/{id}', [ReclamationController::class, 'update']);
Route::delete('/reclamations/{id}', [ReclamationController::class, 'destroy']);

// Routes pour les paiements
Route::get('/payments', [PaymentController::class, 'index']);
Route::post('/payments', [PaymentController::class, 'store']);
Route::get('/payments/{id}', [PaymentController::class, 'show']);
Route::put('/payments', [PaymentController::class, 'update']);
Route::delete('/payments/{id}', [PaymentController::class, 'destroy']);

// Routes pour les partenaires
Route::resource('partenaires', PartenaireController::class);

// Routes pour les ordonnances
Route::resource('ordonances', OrdonanceController::class);

// Routes pour les médicaments
Route::resource('medicaments', MedicamentController::class);

// Routes pour les mutuels
Route::resource('mutuels', MutuelController::class);

// Routes pour les notifications
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/notifications', [NotificationController::class, 'getNotifications']);
    Route::put('/notifications/{id}/mark-as-read', [NotificationController::class, 'markAsRead']);
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);
});

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

    Route::get('/roles', [RolePermissionController::class, 'roles']);
    Route::get('/permissions', [RolePermissionController::class, 'permissions']);

    Route::post('/assign-role', [RolePermissionController::class, 'assignRoleToUser']);
    Route::post('/assign-permission', [RolePermissionController::class, 'assignPermissionToUser']);

Route::get('/rendez-vous/notifications/{user_id}', [RendezVousController::class, 'getNotifications']);

// Routes pour les notifications
Route::get('/notifications/reclamations/{userId}', [NotificationController::class, 'getReclamationNotifications']);

Route::get('/facture/{id}', [FactureController::class, 'generatePDF'])->name('facture.generate');

Route::get('/rendezvous/report/{id}', [RendezvousController::class, 'generateReport'])->name('RendezVous');


Route::get('/ordonance/{id}', [OrdonanceController::class, 'generatePDF'])->name('ordonnance.generate');
Route::get('/certificat-medical/{id}', [CertificatsMedicaleController::class, 'generatePDF'])->name('certificat.generate');


Route::get('/patient/{id}/rapport-medical', [CertificatsMedicaleController::class, 'generatePatientReport'])->name('patient.rapport');