<?php

namespace Database\Factories;

use App\Models\RendezVous;
use App\Models\User;
use App\Models\Departement;
use App\Models\Traitement;
use Illuminate\Database\Eloquent\Factories\Factory;

class RendezVousFactory extends Factory
{
    protected $model = RendezVous::class;

    public function definition(): array
    {
        return [
            'patient_id' => User::role('patient')->inRandomOrder()->first()->id ?? User::factory(),
            'docteur_id' => User::role('doctor')->inRandomOrder()->first()->id ?? User::factory(),
            'departement_id' => Departement::factory(),
            'traitement_id' => Traitement::factory(),
            'date_heure' => $this->faker->dateTimeBetween('now', '+1 month'),
            'motif' => $this->faker->sentence(),
            'notes' => $this->faker->optional()->paragraph(),
            'statut' => $this->faker->randomElement(['en_attente', 'confirme', 'annule', 'termine']),
        ];
    }
} 