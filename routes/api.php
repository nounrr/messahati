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
use App\Http\Controllers\Statestiques\StatestiqueDiagramme\StatistiqueRevenue;
use App\Http\Controllers\Statestiques\StatestiqueDiagramme\StatestiqueAge;
use App\Http\Controllers\Statestiques\StatestiqueDiagramme\StatistiquesTraitements;
use App\Http\Controllers\Statestiques\StatestiqueDiagramme\StatistiquesDepartement;
use App\Http\Controllers\Statestiques\StatestiqueDiagramme\StatistiquesConsultation;
use App\Http\Controllers\Statestiques\StatestiqueDiagramme\StatistiquePayments;
use App\Http\Controllers\Statestiques\StatestiqueDiagramme\StatistiqueHealthSituation;
use App\Http\Controllers\Statestiques\StatestiquesDashboard;
use App\Http\Controllers\FactureController;


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
Route::post('/users', [UserController::class, 'store']);
Route::put('/users', [UserController::class, 'update']);
Route::delete('/users', [UserController::class, 'destroy']);

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
Route::get('rendez-vous/attends', [RendezVousController::class, 'getListeAttends']);
Route::get('rendez-vous/list', [RendezVousController::class, 'getListRendezVous']);
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
Route::get('/notifications/user/{userId}', [NotificationController::class, 'getUserNotifications']);
    Route::delete('/notifications/{id}', [NotificationController::class, 'delete']);
    Route::resource('notifications', NotificationController::class);

    // Routes pour le chat
    Route::post('/send-message', [ChatController::class, 'send']);
    Route::get('/messages/sent/{user_id}', [ChatController::class, 'getSentMessages']);
    Route::get('/messages/received/{user_id}', [ChatController::class, 'getReceivedMessages']);
    Route::get('/chat/users', [ChatController::class, 'getUsers']);
    Route::get('/chat/messages/{user}', [ChatController::class, 'getMessages']);
    Route::post('/chat/messages', [ChatController::class, 'sendMessage']);
    Route::post('/chat/messages/read', [ChatController::class, 'markAsRead']);

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
    Route::post('/{id}/permissions', [RolePermissionController::class, 'updateRolePermissions']);
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


    //Statestiques

//route pou les statestique de revenue 
Route::get('/revenus', [StatistiqueRevenue::class, 'getRevenus']);
//route pour statestique de age 
Route::get('/patientsAge', [StatestiqueAge::class, 'repartitionPatients']);
//pour les statestiques de traitements 
Route::get('/rdv-par-heure-Traitemant', [StatistiquesTraitements::class, 'getStatistiquesParHeure']);
//stat pour departement 
Route::get('/departement', [StatistiquesDepartement::class, 'getPourcentageRendezVousParDepartement']);
//state pour nbr consultation 
Route::get('/consultations-par-jour', [StatistiquesConsultation::class, 'consultationsParJour']);
// route pur  state de paiment 
Route::get('/payements', [StatistiquePayments::class, 'paiementsParJour']);
// route pour state de situation de health 
Route::get('/HealthCore', [StatistiqueHealthSituation::class, 'getHealthCore']);


//dashbord comptabilite 

Route::get('/users/employe-quitte', [StatestiquesDashboard::class, 'employeQuitteAujourdHui']);
Route::get('/users/total-avance', [StatestiquesDashboard::class, 'totalEmployeAvecAvance']);
Route::get('/users/total-paye', [StatestiquesDashboard::class, 'totalEmployePaye']);
//dashboerd  Medicament 

Route::get('/dashboard/medicaments', [StatestiquesDashboard::class, 'statsMedicaments']);
Route::get('/medicaments/epuise', [StatestiquesDashboard::class, 'medicamentsEpuise']);
Route::get('/medicaments/presque-epuise', [StatestiquesDashboard::class, 'medicamentsPresqueEpuise']);
Route::get('/ventes/aujourdhui', [StatestiquesDashboard::class, 'totalVenteAujourdhui']);
// dashboerd RH

Route::get('/dashboard-rh/total-presents', [StatestiquesDashboard::class, 'totalEmployesPresents']);
Route::get('/dashboard-rh/absents', [StatestiquesDashboard::class, 'employesAbsents']);
Route::get('/dashboard-rh/reclamations', [StatestiquesDashboard::class, 'reclamationsDuJour']);

//dashboard agent Client
Route::get('/dashboard/rating-medecin', [StatestiquesDashboard::class, 'getMedecinRating']);
Route::get('/dashboard/rating-infirmiere', [StatestiquesDashboard::class, 'getInfirmiereRating']);
Route::get('/dashboard/reclamations-today', [StatestiquesDashboard::class, 'getReclamationsToday']);

//dashboard directeur 


Route::get('/stats/patients-actifs', [StatestiquesDashboard::class, 'totalPatientsActifs']);
Route::get('/stats/rendez-vous', [StatestiquesDashboard::class, 'totalRendezVousAujourdhui']);
Route::get('/stats/lits-occupes', [StatestiquesDashboard::class, 'capaciteLitsOccupes']);
Route::get('/stats/stock', [StatestiquesDashboard::class, 'disponibiliteStock']);

// dashboard medcin , infermier et receptionniste

Route::get('/stats/rendez-vous-suivant', [StatestiquesDashboard::class, 'rendezVousSuivant']);
Route::get('/stats/rendez-vous-jour-prevu', [StatestiquesDashboard::class, 'totalRendezVousAujourdhuiPrevus']);
Route::get('/stats/patients-passes', [StatestiquesDashboard::class, 'patientsPassesAujourdhui']);

// Routes pour les statistiques
Route::get('/statistiques/revenus', [StatistiqueRevenue::class, 'getRevenus']);

/// Dans routes/api.php
Route::get('/facture/{id}', [FactureController::class, 'generatePDF'])->name('facture.generate');

Route::get('/rendezvous/report/{id}', [RendezvousController::class, 'generateReport'])->name('RendezVous');


Route::get('/ordonnance/{id}', [OrdonanceController::class, 'generatePDF'])->name('ordonnance.generate');
Route::get('/certificat-medical/{id}', [CertificatsMedicaleController::class, 'generatePDF'])->name('certificat.generate');


Route::get('/patient/{id}/rapport-medical', [CertificatsMedicaleController::class, 'generatePatientReport'])->name('patient.rapport');
Route::get('/dashboard-stats', [StatestiquesDashboard::class, 'dashboardStats']);