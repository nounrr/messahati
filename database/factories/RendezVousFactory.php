<?php

namespace Database\Factories;

use App\Models\RendezVous;
use App\Models\User;
use App\Models\Traitement;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\RendezVous>
 */
class RendezVousFactory extends Factory
{
    protected $model = RendezVous::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'date_heure' => $this->faker->dateTimeBetween('now', '+1 month'),
            'status' => $this->faker->randomElement(['en attente', 'confirmé', 'annulé']),
            'patient_id' => User::factory()->create(['role' => 'patient'])->id,
            'docteur_id' => User::factory()->create(['role' => 'docteur'])->id,
            'traitement_id' => Traitement::factory(),
        ];

    }
}
