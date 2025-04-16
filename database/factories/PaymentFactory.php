<?php

// database/factories/PaymentFactory.php

namespace Database\Factories;

use App\Models\RendezVous;
use Illuminate\Database\Eloquent\Factories\Factory;

class PaymentFactory extends Factory
{
    public function definition()
    {
        return [
            'rendez_vous_id' => RendezVous::inRandomOrder()->first()->id ?? RendezVous::factory(),
            'montant' => $this->faker->randomFloat(2, 200, 1500),
            'date' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'status' => $this->faker->boolean(80), // 80% de paiements validés
        ];
    }
}

