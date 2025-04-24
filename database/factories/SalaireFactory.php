<?php

namespace Database\Factories;

use App\Models\Salaire;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Salaire>
 */
class SalaireFactory extends Factory
{
    protected $model = Salaire::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'montant' => $this->faker->randomFloat(2, 2000, 10000),
            'date_paiement' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'status' => $this->faker->randomElement(['en attente', 'payé', 'annulé']),
            'mode_paiement' => $this->faker->randomElement(['virement', 'chèque', 'espèces']),
            'user_id' => User::factory()->create(['role' => 'docteur'])->id,
        ];
    }
}
