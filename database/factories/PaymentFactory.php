<?php

namespace Database\Factories;

use App\Models\Payment;
use App\Models\Patient;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class PaymentFactory extends Factory
{
    protected $model = Payment::class;

    public function definition(): array
    {
        return [
            'patient_id' => Patient::factory(),
            'medecin_id' => User::factory(),
            'montant' => $this->faker->randomFloat(2, 50, 2000),
            'date_paiement' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'mode_paiement' => $this->faker->randomElement(['especes', 'carte', 'virement']),
            'reference' => $this->faker->unique()->uuid(),
            'status' => $this->faker->randomElement(['en_attente', 'complete', 'annule']),
        ];
    }
} 