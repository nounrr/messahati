<?php

namespace Database\Factories;

use App\Models\Tache;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Tache>
 */
class TacheFactory extends Factory
{
    protected $model = Tache::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'titre' => $this->faker->sentence,
            'description' => $this->faker->paragraph,
            'date_debut' => $this->faker->dateTimeBetween('now', '+1 week'),
            'date_fin' => $this->faker->dateTimeBetween('+1 week', '+2 weeks'),
            'status' => $this->faker->randomElement(['à faire', 'en cours', 'terminée', 'annulée']),
            'priorite' => $this->faker->randomElement(['basse', 'moyenne', 'haute', 'urgente']),
            'user_id' => User::factory()->create(['role' => 'docteur'])->id,
        ];
    }
}
