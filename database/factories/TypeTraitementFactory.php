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
            'nom' => $this->faker->unique()->word(),
            'description' => $this->faker->sentence(),
            'prix' => $this->faker->randomFloat(2, 50, 1000),
            'duree' => $this->faker->numberBetween(1, 30),
            'status' => $this->faker->boolean(80),
        ];
    }
} 