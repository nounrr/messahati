<?php

namespace Database\Factories;

use App\Models\Departement;
use Illuminate\Database\Eloquent\Factories\Factory;

class DepartementFactory extends Factory
{
    protected $model = Departement::class;

    public function definition(): array
    {
        return [
            'nom' => $this->faker->unique()->word(),
            'description' => $this->faker->sentence(),
            'status' => $this->faker->boolean(80),
        ];
    }
} 