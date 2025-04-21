<?php

use App\Http\Controllers\AuditLogCliniqueController;
use App\Http\Controllers\ChargeController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DepartementController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\FactureController;

use App\Http\Controllers\Api\ChatController;

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

// Add route for sanctum CSRF cookie
Route::get('/sanctum/csrf-cookie', function () {
    return response()->json(['message' => 'CSRF cookie set']);
});

Route::get('/departments/export', [DepartementController::class, 'export'])->name('departements.export');
Route::get('/charges/export', [ChargeController::class, 'export'])->name('charges.export');
Route::get('/payments/export', [PaymentController::class, 'export'])->name('payments.export');
Route::get('/users/export', [UserController::class, 'export'])->name('users.export');
Route::get('/audit-logs/export', [AuditLogCliniqueController::class, 'export'])->name('audit_logs.export');





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


// Routes pour les réclamations, feedbacks et mutuels - protégées par auth
Route::middleware(['auth'])->resource('reclamation', ReclamationController::class);
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


Route::get('/rdv', function () {
    return Inertia::render('Components/RDV/CalendarMainLayer');
})->name('rdv.view');

// Route pour accéder à la vue du chat
Route::get('/chat', function () {
    return Inertia::render('Components/Chat/ChatMessageLayer');
})->name('chat.view');


// Route::post('/send-data', [App\Http\Controllers\RealTimeController::class, 'sendData']);

// Route pour les types de partenaires
Route::get('/type-partenaires', function () {
    return Inertia::render('ListTable/ListeTypePartenaires');
})->name('type-partenaires.view'); //done

// Route pour gérer les permissions directes des utilisateurs
Route::get('/model-permissions', function () {
    return Inertia::render('Components/ModelPermissionManager');
})->name('model-permissions.view');

Route::get('/type-medicaments', function () {
    return Inertia::render('ListTable/ListeTypeMedicaments');
})->name('type-medicaments.view'); //done

Route::get('/type-traitements', function () {
    return Inertia::render('ListTable/ListeTypeTraitements');
})->name('type-traitements.view'); //done

// Route pour la liste des réclamations - protégée par auth
Route::middleware(['auth'])->get('/reclamations', function () {
    return Inertia::render('ListTable/ListeReclamations');
})->name('reclamations.view');

Route::get('/Audit', function () {
    return Inertia::render('ListTable/ListeAuditLogCliniques');
})->name('audit.view');

Route::get('/Certificat', function () {
    return Inertia::render('ListTable/ListeCertificat');
})->name('certificat.view');

Route::get('/departement-table', function () {
    return Inertia::render('ListTable/ListeDepartements');
})->name('departement.view');

Route::get('/feedbacks', function () {
    return Inertia::render('ListTable/ListeFeedbacks');
})->name('feedback.view');

Route::get('/traitements', function () {
    return Inertia::render('ListTable/ListeTraitements');
})->name('traitements.view');

Route::get('/mutuels', function () {
    return Inertia::render('ListTable/ListeMutuels');
})->name('mutuels.view'); //done

Route::get('/partenaires', function () {
    return Inertia::render('ListTable/ListePartenaires'); //done
})->name('partenaire.view');

Route::get('/ordonnances', function () {
    return Inertia::render('ListTable/ListeOrdonnance');
})->name('ordonnance.view');

Route::get('/payments', function () {
    return Inertia::render('ListTable/ListePayments');
})->name('payment.view');

Route::get('/salaires', function () {
    return Inertia::render('ListTable/ListeSalaires');
})->name('salaire.view'); //done

Route::get('/charges', function () {
    return Inertia::render('ListTable/ListeCharges');
})->name('charges.view'); //Done



Route::get('/facture/{id}', [FactureController::class, 'generatePDF'])->name('facture.generate');

require __DIR__.'/auth.php';
