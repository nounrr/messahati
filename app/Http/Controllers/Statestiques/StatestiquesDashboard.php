<?php

namespace App\Http\Controllers\Statestiques;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Reclamation;
use App\Models\Payment;
use Illuminate\Support\Carbon;
use App\Models\Medicament;
use App\Models\Feedback;
use App\Models\Materiel;
use App\Models\RendezVous;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class StatestiquesDashboard extends Controller
{


    

    //this is the controller of statestiques of dashboard in the little divs with colors  

     // Dashboerd Comptable

    
 
     public function totalEmployeAvecAvance()
     {
         $total = Payment::where('status', 'avance')
             ->whereDate('date', now()->toDateString())
             ->whereHas('rendezvous.user.roles', function ($q) {
                 $q->where('name', '!=', 'patient');
             })
             ->distinct('rendez_vous_id')
             ->count();
 
         return response()->json(['total_avance' => $total]);
     }
 
     public function totalEmployePaye()
     {
         $total = Payment::where('status', 'payé')
             ->whereDate('date', now()->toDateString())
             ->whereHas('rendezVous.user.roles', function ($q) {
                 $q->where('name', '!=', 'patient');
             })
             ->distinct('rendez_vous_id')
             ->count();
 
         return response()->json(['total_paye' => $total]);
     }
 
     public function statsDashboard()
     {
         return response()->json([
             'employe_quitte' => $this->employeQuitteAujourdHui()->getData(),
             'total_avance' => $this->totalEmployeAvecAvance()->getData()->total_avance,
             'total_paye' => $this->totalEmployePaye()->getData()->total_paye,
         ]);
     }
 
 
 //dashbord RH
     public function totalEmployesPresents()
     {
         $total = User::whereHas('roles', function ($query) {
                 $query->where('name', '!=', 'patient');
             })
             ->where('status', true)
             ->count();
 
         return response()->json(['total_presents' => $total]);
     }
 
     /**
      * Liste des employés absents (status = false et rôle != patient)
      */
     public function employesAbsents()
     {
         $absents = User::whereHas('roles', function ($query) {
                 $query->where('name', '!=', 'patient');
             })
             ->where('status', false)
             ->get();
 
         return response()->json(['absents' => $absents]);
     }
 
     /**
      * Réclamations du jour (statut = en_attente)
      */
     public function reclamationsDuJour()
     {
         $reclamations = Reclamation::whereDate('created_at', today())
             ->where('statut', 'en_attente')
             ->with('user')
             ->get();
 
         return response()->json(['reclamations' => $reclamations]);
     }

// Dashboard Pharmacien


     // 📦 Médicaments épuisésBABARE
    public function medicamentsEpuise()
    {
        $medicaments = Medicament::where('quantite', 0)->get();
        return response()->json($medicaments);
    }

    // 📉 Médicaments presque épuisés (quantité entre 1 et 20)
    public function medicamentsPresqueEpuise()
    {
        $medicaments = Medicament::where('quantite', '<=', 20)
                                ->where('quantite', '>', 0)
                                ->get();
        return response()->json($medicaments);
    }

    // 🧮 Total médicaments vendus aujourd'hui
    public function totalVenteAujourdhui()
    {
        $total = DB::table('vendus')
            ->whereDate('created_at', now()->toDateString())
            ->sum('quantite');

        return response()->json(['total_vendu' => $total]);
    }

    // 📊 Dashboard résumé
    public function statsMedicaments()
    {
        return response()->json([
            'epuise' => $this->medicamentsEpuise()->getData(),
            'presque_epuise' => $this->medicamentsPresqueEpuise()->getData(),
            'total_vendus' => $this->totalVenteAujourdhui()->getData()->total_vendu,
        ]);
    }

// Dashboard Agent Client

// Rating des medcin(agent client)
public function getMedecinRating()
{
    $medecin = \App\Models\User::role('doctor')->with('feedbacks')->first();

    if ($medecin) {
        $averageRating = round($medecin->feedbacks()->avg('rating'), 1);

        return response()->json([
            'nom' => $medecin->name,
            'specialite' => $medecin->specialite ?? 'Cardiologie',
            'rating' => $averageRating,
            'photo' => $medecin->photo ?? null,
        ]);
    } else {
        return response()->json(['message' => 'Aucun médecin trouvé'], 404);
    }
}
// rating des infermiers 
public function getInfirmiereRating()
{
    $infirmiere = \App\Models\User::role('nurse')->with('feedbacks')->first();

    if ($infirmiere) {
        $averageRating = round($infirmiere->feedbacks()->avg('rating'), 1);

        return response()->json([
            'nom' => $infirmiere->name,
            'specialite' => $infirmiere->specialite ?? 'Générale',
            'rating' => $averageRating,
            'photo' => $infirmiere->photo ?? null,
        ]);
    } else {
        return response()->json(['message' => 'Aucune infirmière trouvée'], 404);
    }
}
//total des relamations pour dashboerd agent clinet 
public function getReclamationsToday()
{
    $today = Carbon::today()->toDateString();

    $reclamations = Feedback::whereDate('date', $today)
                            ->where('status', 1)
                            ->count();

    return response()->json([
        'date' => $today,
        'total_reclamations' => $reclamations
    ]);
}
//directeur dashboard

    // 🧍‍♂️ Total de patients actifs
    public function totalPatientsActifs()
    {
        $count = User::role('patient')
            ->where('status', true)
            ->count();

        return response()->json([
            'total_patients_actifs' => $count
        ]);
    }

    // 📅 Total de rendez-vous  aujourd'hui
    public function totalRendezVousAujourdhui()
    {
        $count = RendezVous::whereDate('date_heure', Carbon::today())
            ->count();
        return response()->json([
            'total_rendez_vous_aujourdhui' => $count
        ]);
    }

    // 🛏️ Pourcentage des lits occupés
    public function capaciteLitsOccupes()
    {
        $totalLits = Materiel::where('libelle', 'lit')->sum('quantite');
        $litsOccupes = Materiel::where('libelle', 'lit')->where('status', true)->sum('quantite');

        $pourcentage = $totalLits > 0 ? round(($litsOccupes / $totalLits) * 100) : 0;

        return response()->json([
            'capacite_lits_occupes' => $pourcentage
        ]);
    }

    // 📦 Disponibilité dans le stock
    public function disponibiliteStock()
    {
        $totalMateriels = Materiel::sum('quantite');
        $materielsUtilises = Materiel::where('status', true)->sum('quantite');

        $disponible = $totalMateriels - $materielsUtilises;
        $pourcentage = $totalMateriels > 0 ? round(($disponible / $totalMateriels) * 100) : 0;

        return response()->json([
            'disponibilite_stock' => $pourcentage
        ]);
    }
    // medcin , infermier et receptionniste dashboard 

     // 1. Rendez-vous suivant
     public function rendezVousSuivant()
     {
         $now = Carbon::now();
 
         $rendezVous = RendezVous::where('date_heure', '>=', $now)
             ->where('statut', '!=', true)
             ->orderBy('date_heure', 'asc')
             ->with(['patient', 'traitement']) // si tu as des relations définies
             ->first();
 
         if (!$rendezVous) {
             return response()->json(['message' => 'Aucun rendez-vous à venir']);
         }
 
         return response()->json([
             'nom_patient' => $rendezVous->patient->name . ' ' . $rendezVous->patient->prenom,
             'traitement' => $rendezVous->traitement->libelle ?? '',
             'heure' => Carbon::parse($rendezVous->date_heure)->format('H:i'),
             'image' => $rendezVous->patient->img_path ?? null,
         ]);
     }
 
     // 2. Total des rendez-vous aujourd'hui n'est pas passe
     public function totalRendezVousAujourdhuiPrevus()
    {
        $count = RendezVous::whereDate('date_heure', Carbon::today())
            ->where('statut', false)
            ->count();
        return response()->json([
            'total_rendez_vous_aujourdhui' => $count
        ]);
    }
 
     // 3. Total des patients passés aujourd'hui
     public function patientsPassesAujourdhui()
     {
         $count = RendezVous::whereDate('date_heure', Carbon::today())
             ->where('statut', true) // ou `true` selon ton système
             ->count();
 
         return response()->json([
             'patients_passes' => $count
         ]);
     }
     // In StatestiquesDashboard.php

    public function dashboardStats()
    {
        return response()->json([
            'total_avance' => $this->totalEmployeAvecAvance()->getData()->total_avance,
            'total_paye' => $this->totalEmployePaye()->getData()->total_paye,
            'total_presents' => $this->totalEmployesPresents()->getData()->total_presents,
            'absents' => $this->employesAbsents()->getData()->absents,
            'reclamations' => $this->reclamationsDuJour()->getData()->reclamations,
            'medicaments_epuise' => $this->medicamentsEpuise()->getData(),
            'medicaments_presque_epuise' => $this->medicamentsPresqueEpuise()->getData(),
            'total_vendus' => $this->totalVenteAujourdhui()->getData()->total_vendu,
            'medecin_rating' => $this->getMedecinRating()->getData(),
            'infirmiere_rating' => $this->getInfirmiereRating()->getData(),
            'reclamations_today' => $this->getReclamationsToday()->getData()->total_reclamations,
            'total_patients_actifs' => $this->totalPatientsActifs()->getData()->total_patients_actifs,
            'total_rendez_vous_aujourdhui' => $this->totalRendezVousAujourdhui()->getData()->total_rendez_vous_aujourdhui,
            'capacite_lits_occupes' => $this->capaciteLitsOccupes()->getData()->capacite_lits_occupes,
            'disponibilite_stock' => $this->disponibiliteStock()->getData()->disponibilite_stock,
            'rendez_vous_suivant' => $this->rendezVousSuivant()->getData(),
            'total_rendez_vous_prevus' => $this->totalRendezVousAujourdhuiPrevus()->getData()->total_rendez_vous_aujourdhui,
            'patients_passes' => $this->patientsPassesAujourdhui()->getData()->patients_passes,
        ]);
    }
    

 
}



