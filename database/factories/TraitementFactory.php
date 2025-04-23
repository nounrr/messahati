<?php

namespace Database\Factories;

use App\Models\Traitement;
use App\Models\TypeTraitement;
use Illuminate\Database\Eloquent\Factories\Factory;

class TraitementFactory extends Factory
{
    protected $model = Traitement::class;

    public function definition(): array
    {
        return [
            'type_traitement_id' => TypeTraitement::factory(),
            'description' => $this->faker->paragraph(),
            'date_debut' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'date_fin' => $this->faker->dateTimeBetween('now', '+3 months'),
            'status' => $this->faker->randomElement(['en_cours', 'termine', 'annule']),
        ];
    }
} 