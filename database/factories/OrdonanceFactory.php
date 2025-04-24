<?php

namespace Database\Factories;

use App\Models\Ordonance;
use App\Models\User;
use App\Models\Traitement;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Ordonance>
 */
class OrdonanceFactory extends Factory
{
    protected $model = Ordonance::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'date_emission' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'description' => $this->faker->paragraph,
            'patient_id' => User::factory()->create(['role' => 'patient'])->id,
            'docteur_id' => User::factory()->create(['role' => 'docteur'])->id,
            'traitement_id' => Traitement::factory()->create()->id,
        ];
    }
}
