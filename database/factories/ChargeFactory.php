<?php

// database/factories/ChargeFactory.php

namespace Database\Factories;

use App\Models\Partenaire;
use Illuminate\Database\Eloquent\Factories\Factory;

class ChargeFactory extends Factory
{
    public function definition()
    {
        return [
            'nom' => $this->faker->word(),
            'prix_unitaire' => $this->faker->randomFloat(2, 50, 1000),
            'quantite' => $this->faker->numberBetween(1, 20),
            'partenaire_id' => Partenaire::inRandomOrder()->first()->id ?? Partenaire::factory(),
        ];
    }
}

