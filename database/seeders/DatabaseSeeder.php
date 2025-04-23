<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\TypeTraitement;
use App\Models\TypeMedicament;
use App\Models\TypeCertificat;
use App\Models\TypePartenaire;
use App\Models\Clinique;
use App\Models\Departement;
use App\Models\Traitement;
use App\Models\Rendezvous;
use App\Models\Ordonance;
use App\Models\Medicament;
use App\Models\CertificatMedicale;
use App\Models\Mutuel;
use App\Models\Partenaire;
use App\Models\Materiel;
use App\Models\Salaire;
use App\Models\Charge;
use App\Models\Reclamation;
use App\Models\Feedback;
use App\Models\Tache;
use App\Models\Message;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            CliniqueSeeder::class,
            DepartementSeeder::class,
            RolesAndPermissionsSeeder::class,
            UserSeeder::class,
        ]);

        // Créer les types
        TypeTraitement::factory()->count(10)->create();
        TypeMedicament::factory()->count(10)->create();
        TypeCertificat::factory()->count(10)->create();
        TypePartenaire::factory()->count(10)->create();

        // Créer les cliniques et départements
        $cliniques = Clinique::factory()->count(5)->create();
        foreach ($cliniques as $clinique) {
            Departement::factory()->count(5)->create(['clinique_id' => $clinique->id]);
        }

        // Créer les mutuelles et partenaires
        Mutuel::factory()->count(10)->create();
        Partenaire::factory()->count(20)->create();

        // Créer les matériels
        Materiel::factory()->count(20)->create();

        // Créer les utilisateurs (100)
        $users = User::factory()->count(100)->create();

        // Pour chaque utilisateur, créer des données associées
        foreach ($users as $user) {
            if ($user->hasRole('patient')) {
                // Créer des traitements pour le patient
                $traitements = Traitement::factory()->count(10)->create(['patient_id' => $user->id]);
                
                foreach ($traitements as $traitement) {
                    // Créer des rendez-vous pour chaque traitement
                    Rendezvous::factory()->count(2)->create([
                        'patient_id' => $user->id,
                        'traitement_id' => $traitement->id,
                        'docteur_id' => User::role('docteur')->inRandomOrder()->first()?->id,
                        'departement_id' => Departement::inRandomOrder()->first()?->id,
                    ]);

                    // Créer des ordonnances pour chaque traitement
                    $ordonances = Ordonance::factory()->count(2)->create([
                        'patient_id' => $user->id,
                        'traitement_id' => $traitement->id
                    ]);

                    foreach ($ordonances as $ordonance) {
                        // Ajouter des médicaments à chaque ordonnance
                        $medicaments = Medicament::factory()->count(3)->create();
                        foreach ($medicaments as $medicament) {
                            $ordonance->medicaments()->attach($medicament->id, [
                                'dosage' => '1 comprimé',
                                'frequence' => '2 fois par jour',
                                'duree' => '7 jours'
                            ]);
                        }
                    }

                    // Créer des certificats médicaux pour chaque traitement
                    CertificatMedicale::factory()->count(2)->create([
                        'patient_id' => $user->id,
                        'traitement_id' => $traitement->id
                    ]);
                }

                // Créer des réclamations pour le patient
                Reclamation::factory()->count(2)->create(['user_id' => $user->id]);

                // Créer des retours d'expérience pour le patient
                Feedback::factory()->count(2)->create(['user_id' => $user->id]);
            }

            if ($user->hasRole('docteur')) {
                // Créer des tâches pour le docteur
                Tache::factory()->count(5)->create(['user_id' => $user->id]);

                // Créer des salaires pour le docteur
                Salaire::factory()->count(12)->create(['user_id' => $user->id]);

                // Créer des messages pour le docteur
                Message::factory()->count(10)->create(['expediteur_id' => $user->id]);
            }
        }

        // Créer des charges
        Charge::factory()->count(50)->create();
        
    }
}
