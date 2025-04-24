<?php

namespace Database\Factories;

use App\Models\TypeTraitement;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TypeTraitement>
 */
class TypeTraitementFactory extends Factory
{
    protected $model = TypeTraitement::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nom' => $this->faker->unique()->randomElement([
                'Consultation générale',
                'Chirurgie',
                'Radiologie',
                'Analyses de laboratoire',
                'Physiothérapie',
                'Dentisterie',
                'Ophtalmologie',
                'Cardiologie',
                'Dermatologie',
                'Pédiatrie'
            ]),
            'description' => $this->faker->paragraph,
        ];
    }
}
