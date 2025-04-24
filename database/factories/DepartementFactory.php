<?php

namespace Database\Factories;

use App\Models\Departement;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Departement>
 */
class DepartementFactory extends Factory
{
    protected $model = Departement::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nom' => $this->faker->randomElement([
                'Cardiologie',
                'Neurologie',
                'Pédiatrie',
                'Gynécologie',
                'Orthopédie',
                'Dermatologie',
                'Ophtalmologie',
                'ORL',
                'Radiologie',
                'Urgences'
            ]),
            'description' => $this->faker->paragraph,
            'img_path' => $this->faker->imageUrl(640, 480, 'department'),
        ];
    }
}
