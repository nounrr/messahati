<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Traitement;
use App\Models\TypeTraitement;
use Carbon\Carbon;

class TraitementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Vérifier si des types de traitements existent
        if (TypeTraitement::count() === 0) {
            $this->call(TypeTraitementSeeder::class);
        }

        // Récupérer tous les types de traitements
        $typeTraitements = TypeTraitement::all();
        
        if ($typeTraitements->isEmpty()) {
            $this->command->info('Aucun type de traitement trouvé. Veuillez exécuter TypeTraitementSeeder d\'abord.');
            return;
        }

        // Créer 50 traitements
        for ($i = 0; $i < 50; $i++) {
            $typeTraitement = $typeTraitements->random();
            
            // Générer une date de début aléatoire dans les 6 derniers mois
            $dateDebut = Carbon::now()->subMonths(rand(0, 6))->subDays(rand(0, 30));
            
            // 70% des traitements ont une date de fin (30% sont en cours)
            $dateFin = null;
            if (rand(1, 100) <= 70) {
                // La date de fin est entre la date de début et aujourd'hui
                $dateFin = $dateDebut->copy()->addDays(rand(1, 180));
                if ($dateFin->isAfter(Carbon::now())) {
                    $dateFin = Carbon::now();
                }
            }
            
            Traitement::create([
                'typetraitement_id' => $typeTraitement->id,
                'description' => $this->getDescriptionForType($typeTraitement->nom),
                'date_debut' => $dateDebut,
                'date_fin' => $dateFin,
            ]);
        }
    }
    
    /**
     * Génère une description réaliste en fonction du type de traitement
     */
    private function getDescriptionForType($typeNom)
    {
        $descriptions = [
            'Consultation générale' => [
                'Consultation de routine avec examen physique complet.',
                'Bilan de santé annuel avec recommandations personnalisées.',
                'Suivi post-traitement avec évaluation des progrès.',
                'Consultation de prévention avec conseils sur le mode de vie.',
            ],
            'Traitement dentaire' => [
                'Détartrage et nettoyage professionnel des dents.',
                'Traitement d\'une carie avec obturation.',
                'Extraction d\'une dent de sagesse.',
                'Pose d\'une couronne dentaire.',
            ],
            'Physiothérapie' => [
                'Séance de rééducation pour récupération après blessure.',
                'Exercices thérapeutiques pour renforcement musculaire.',
                'Massage thérapeutique pour soulagement de la douleur.',
                'Traitement par ultrasons pour inflammation.',
            ],
            'Chimiothérapie' => [
                'Cycle de chimiothérapie standard pour traitement du cancer.',
                'Chimiothérapie adjuvante post-chirurgie.',
                'Chimiothérapie néoadjuvante avant intervention chirurgicale.',
                'Traitement de maintenance pour contrôle de la maladie.',
            ],
            'Radiothérapie' => [
                'Séance de radiothérapie externe pour tumeur localisée.',
                'Radiothérapie conformationnelle 3D pour précision accrue.',
                'Radiothérapie palliative pour soulagement des symptômes.',
                'Radiothérapie préopératoire pour réduction tumorale.',
            ],
            'Chirurgie' => [
                'Intervention chirurgicale programmée pour correction.',
                'Chirurgie d\'urgence pour situation critique.',
                'Chirurgie mini-invasive avec technique laparoscopique.',
                'Chirurgie reconstructrice post-traumatique.',
            ],
            'Dialyse' => [
                'Séance d\'hémodialyse pour insuffisance rénale.',
                'Dialyse péritonéale continue ambulatoire.',
                'Dialyse péritonéale automatisée nocturne.',
                'Séance de dialyse d\'urgence pour situation critique.',
            ],
            'Psychothérapie' => [
                'Séance de thérapie cognitive-comportementale.',
                'Thérapie de groupe pour soutien mutuel.',
                'Thérapie familiale pour résolution de conflits.',
                'Séance individuelle pour gestion du stress.',
            ],
            'Rééducation' => [
                'Programme de rééducation après accident vasculaire cérébral.',
                'Rééducation orthopédique post-chirurgie.',
                'Rééducation respiratoire pour maladie pulmonaire.',
                'Rééducation cardiaque après infarctus.',
            ],
            'Traitement ophtalmologique' => [
                'Examen ophtalmologique complet avec correction.',
                'Traitement au laser pour correction de la vision.',
                'Chirurgie de la cataracte.',
                'Traitement du glaucome.',
            ],
        ];
        
        // Description par défaut si le type n'est pas dans la liste
        $defaultDescriptions = [
            'Traitement médical standard avec suivi régulier.',
            'Intervention thérapeutique personnalisée selon les besoins du patient.',
            'Protocole de traitement adapté à la condition spécifique.',
            'Prise en charge complète avec évaluation continue.',
        ];
        
        // Retourner une description aléatoire du type spécifique ou par défaut
        if (isset($descriptions[$typeNom])) {
            return $descriptions[$typeNom][array_rand($descriptions[$typeNom])];
        } else {
            return $defaultDescriptions[array_rand($defaultDescriptions)];
        }
    }
}