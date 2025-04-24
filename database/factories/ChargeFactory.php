<?php

namespace Database\Factories;

use App\Models\Charge;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Charge>
 */
class ChargeFactory extends Factory
{
    protected $model = Charge::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nom' => $this->faker->sentence,
            'prix_unitaire' => $this->faker->randomFloat(2, 100, 5000),
            'quantite' => $this->faker->numberBetween(1, 10),
            'partenaire_id' => \App\Models\Partenaire::factory(),
            'status' => $this->faker->randomElement(['en attente', 'payé', 'annulé']),
        ];
    }
}
