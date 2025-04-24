<?php

namespace Database\Factories;

use App\Models\Reclamation;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Reclamation>
 */
class ReclamationFactory extends Factory
{
    protected $model = Reclamation::class;

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
            'status' => $this->faker->randomElement(['en attente', 'en cours', 'résolu', 'rejeté']),
            'date_creation' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'date_resolution' => $this->faker->optional()->dateTimeBetween('now', '+1 month'),
            'user_id' => User::factory()->create(['role' => 'patient'])->id,
        ];
    }
}
