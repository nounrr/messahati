<?php

namespace Database\Factories;

use App\Models\MedicamentOrdonance;
use App\Models\Ordonance;
use App\Models\Medicament;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\MedicamentOrdonance>
 */
class MedicamentOrdonanceFactory extends Factory
{
    protected $model = MedicamentOrdonance::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'ordonance_id' => Ordonance::factory()->create()->id,
            'medicament_id' => Medicament::factory()->create()->id,
            'dosage' => $this->faker->randomElement(['1 comprimé', '2 comprimés', '1 cuillère', '1 ampoule']),
            'frequence' => $this->faker->randomElement(['1 fois par jour', '2 fois par jour', '3 fois par jour', '1 fois par semaine']),
            'duree' => $this->faker->randomElement(['7 jours', '10 jours', '14 jours', '1 mois']),
        ];
    }
}
