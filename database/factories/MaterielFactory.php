<?php

namespace Database\Factories;

use App\Models\Materiel;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Materiel>
 */
class MaterielFactory extends Factory
{
    protected $model = Materiel::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'libelle' => $this->faker->randomElement([
                'Stéthoscope',
                'Tensiomètre',
                'Électrocardiographe',
                'Défibrillateur',
                'Ventilateur',
                'Microscope',
                'Échographe',
                'Radiographie',
                'Scanner',
                'IRM'
            ]),
            'quantite' => $this->faker->numberBetween(1, 10),
            'status' => $this->faker->boolean(),
            'clinique_id' => \App\Models\Clinique::factory(),
        ];
    }
}
