<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Reclamation;
use App\Models\Payment;
use App\Models\Medicament;
use App\Models\Feedback;
use App\Models\Materiel;
use App\Models\RendezVous;
use Carbon\Carbon;
use Spatie\Permission\Models\Role;

class StatistiquesSeeder extends Seeder
{
    public function run(): void
    {
        // Create roles if they don't exist
        $roles = ['doctor', 'nurse', 'secretary', 'patient'];
        foreach ($roles as $role) {
            Role::firstOrCreate(['name' => $role]);
        }

        // Create users with different roles
        $medecin = User::factory()->create([
            'name' => 'Dr. Smith',
            'email' => 'doctor@example.com',
            'status' => true,
            'img_path' => 'doctor.jpg',
            'date_naissance' => now()->subYears(40),
            'Age' => 40
        ]);
        $medecin->assignRole('doctor');

        $infirmiere = User::factory()->create([
            'name' => 'Nurse Johnson',
            'email' => 'nurse@example.com',
            'status' => true,
            'img_path' => 'nurse.jpg',
            'date_naissance' => now()->subYears(35),
            'Age' => 35
        ]);
        $infirmiere->assignRole('nurse');

        $receptionniste = User::factory()->create([
            'name' => 'Secretary Brown',
            'email' => 'secretary@example.com',
            'status' => true,
            'date_naissance' => now()->subYears(30),
            'Age' => 30
        ]);
        $receptionniste->assignRole('secretary');

        // Create some patients
        $patients = User::factory()->count(5)->create();
        foreach ($patients as $patient) {
            $patient->assignRole('patient');
        }

        // Create reclamations
        Reclamation::create([
            'titre' => 'Problème de facturation',
            'description' => 'Erreur dans la facture du dernier rendez-vous.',
            'statut' => 'en_attente',
            'user_id' => $patients[0]->id,
            'created_at' => now()
        ]);

        // Create type medicaments
        $typeMedicament = \App\Models\TypeMedicament::create([
            'nom' => 'Analgésiques'
        ]);

        // Create medicaments
        Medicament::create([
            'nom_medicament' => 'Paracétamol',
            'quantite' => 0,
            'prix_unitaire' => 5.99,
            'typemedicaments_id' => $typeMedicament->id,
            'date_expiration' => now()->addYear(),
            'img_path' => null
        ]);

        Medicament::create([
            'nom_medicament' => 'Ibuprofène',
            'quantite' => 15,
            'prix_unitaire' => 7.99,
            'typemedicaments_id' => $typeMedicament->id,
            'date_expiration' => now()->addYear(),
            'img_path' => null
        ]);

        // Create feedbacks
        Feedback::create([
            'user_id' => $medecin->id,
            'contenu' => 'Excellent service',
            'rating' => 4.5,
            'date' => now(),
            'status' => true
        ]);

        Feedback::create([
            'user_id' => $infirmiere->id,
            'contenu' => 'Très professionnelle',
            'rating' => 4.8,
            'date' => now(),
            'status' => true
        ]);

        // Create clinique
        $clinique = \App\Models\Clinique::create([
            'nom' => 'Clinique Exemple',
            'adresse' => '123 Rue Exemple',
            'email' => 'contact@clinique-exemple.com',
            'site_web' => 'www.clinique-exemple.com',
            'description' => 'Une clinique moderne et accueillante'
        ]);

        // Create materiels
        Materiel::create([
            'clinique_id' => $clinique->id,
            'libelle' => 'lit',
            'quantite' => 20,
            'status' => true
        ]);

        Materiel::create([
            'clinique_id' => $clinique->id,
            'libelle' => 'chaise roulante',
            'quantite' => 5,
            'status' => false
        ]);

        // Create type traitement
        $typeTraitement = \App\Models\TypeTraitement::create([
            'nom' => 'Consultation générale',
            'prix-default' => 100.00
        ]);

        // Create traitement
        $traitement = \App\Models\Traitement::create([
            'typetraitement_id' => $typeTraitement->id,
            'description' => 'Consultation de routine',
            'date_debut' => now(),
            'date_fin' => now()->addDays(7)
        ]);

        // Create rendez-vous
        RendezVous::create([
            'date_heure' => now()->addHours(2),
            'statut' => true,
            'patient_id' => $patients[0]->id,
            'docteur_id' => $medecin->id,
            'departement_id' => 1,
            'traitement_id' => $traitement->id
        ]);

        RendezVous::create([
            'date_heure' => now()->addHours(4),
            'statut' => false,
            'patient_id' => $patients[1]->id,
            'docteur_id' => $medecin->id,
            'departement_id' => 1,
            'traitement_id' => $traitement->id
        ]);

        // Create payments
        Payment::create([
            'rendez_vous_id' => 1,
            'montant' => 100,
            'date' => now(),
            'payment_method' => 'espece',
            'status' => 'avance'
        ]);

        Payment::create([
            'rendez_vous_id' => 2,
            'montant' => 200,
            'date' => now(),
            'payment_method' => 'carte-bancaire',
            'status' => 'payé'
        ]);
    }
} 