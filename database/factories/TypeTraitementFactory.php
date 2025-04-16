<?php

namespace Database\Factories;

use App\Models\TypeTraitement;
use Illuminate\Database\Eloquent\Factories\Factory;

class TypeTraitementFactory extends Factory
{
    protected $model = TypeTraitement::class;

    public function definition(): array
    {
        return [
            'nom' => $this->faker->randomElement(['consultation', 'soin', 'radiologie']),
            'prix-default' => $this->faker->randomFloat(2, 10, 100)
        ];
    }
}

