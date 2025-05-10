<?php

namespace Database\Factories;

use App\Models\Ordonance;
use App\Models\Patient;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrdonanceFactory extends Factory
{
    protected $model = Ordonance::class;

    public function definition(): array
    {
        return [
            'patient_id' => Patient::factory(),
            'medecin_id' => User::factory(),
            'date' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'description' => $this->faker->paragraph(),
            'status' => $this->faker->randomElement(['en_cours', 'termine', 'annule']),
        ];
    }
} 