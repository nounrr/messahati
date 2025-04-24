<?php

namespace Database\Factories;

use App\Models\Traitement;
use App\Models\TypeTraitement;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Traitement>
 */
class TraitementFactory extends Factory
{
    protected $model = Traitement::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'description' => $this->faker->paragraph,
            'date_debut' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'date_fin' => $this->faker->dateTimeBetween('now', '+6 months'),
            'typetraitement_id' => TypeTraitement::factory(),
        ];
    }
}
