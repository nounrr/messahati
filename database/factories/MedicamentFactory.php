<?php

namespace Database\Factories;

use App\Models\Medicament;
use App\Models\TypeMedicament;
use Illuminate\Database\Eloquent\Factories\Factory;

class MedicamentFactory extends Factory
{
    protected $model = Medicament::class;

    public function definition(): array
    {
        return [
            'nom' => $this->faker->unique()->word(),
            'type_medicament_id' => TypeMedicament::factory(),
            'description' => $this->faker->paragraph(),
            'prix_unitaire' => $this->faker->randomFloat(2, 10, 500),
            'quantite' => $this->faker->numberBetween(10, 1000),
            'date_expiration' => $this->faker->dateTimeBetween('+6 months', '+2 years'),
            'status' => $this->faker->boolean(80),
        ];
    }
} 