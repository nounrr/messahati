<?php

namespace Database\Factories;

use App\Models\Payment;
use App\Models\RendezVous;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Payment>
 */
class PaymentFactory extends Factory
{
    protected $model = Payment::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'montant' => $this->faker->randomFloat(2, 50, 1000),
            'date' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'status' => $this->faker->randomElement(['en attente', 'payé', 'annulé', 'remboursé']),
            'mode_paiement' => $this->faker->randomElement(['espèces', 'carte bancaire', 'chèque', 'virement']),
            'rendez_vous_id' => RendezVous::factory(),
        ];
    }
}
