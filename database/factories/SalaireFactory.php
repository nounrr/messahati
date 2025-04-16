<?php

// database/factories/SalaireFactory.php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class SalaireFactory extends Factory
{
    public function definition()
    {
        return [
            'montant' => $this->faker->randomFloat(2, 1000, 5000),
            'primes' => $this->faker->randomFloat(2, 100, 500),
            'date' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'user_id' => User::inRandomOrder()->first()->id ?? User::factory(),
        ];
    }
}
