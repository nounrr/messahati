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
use App\Http\Controllers\Statestiques\StatestiqueDiagramme\StatistiqueRevenue;
use App\Http\Controllers\Statestiques\StatestiqueDiagramme\StatestiqueAge;
use App\Http\Controllers\Statestiques\StatestiqueDiagramme\StatistiquesTraitements;
use App\Http\Controllers\Statestiques\StatestiqueDiagramme\StatistiquesDepartement;
use App\Http\Controllers\Statestiques\StatestiqueDiagramme\StatistiquesConsultation;
use App\Http\Controllers\Statestiques\StatestiqueDiagramme\StatistiquePayments;
use App\Http\Controllers\Statestiques\StatestiqueDiagramme\StatistiqueHealthSituation;
use App\Http\Controllers\Statestiques\StatestiquesDashboard;
use App\Http\Controllers\Auth\RegisteredUserController;


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

    Route::get('/roles', [RolePermissionController::class, 'roles']);
    Route::get('/permissions', [RolePermissionController::class, 'permissions']);

    Route::post('/assign-role', [RolePermissionController::class, 'assignRoleToUser']);
    Route::post('/assign-permission', [RolePermissionController::class, 'assignPermissionToUser']);

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

Route::get('/dashboard-stats', [StatestiquesDashboard::class, 'dashboardStats']);



