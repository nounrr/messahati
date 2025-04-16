<?php


namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\TypeTraitement;

class TraitementFactory extends Factory
{
    public function definition(): array
    {
        $dateDebut = $this->faker->dateTimeBetween('-1 year', 'now');
        $dateFin = $this->faker->boolean(70) ? $this->faker->dateTimeBetween($dateDebut, 'now') : null;

        return [
            'typetraitement_id' => TypeTraitement::inRandomOrder()->first()->id ?? TypeTraitement::factory(),
            'description' => $this->faker->sentence(8),
            'date_debut' => $dateDebut,
            'date_fin' => $dateFin,
        ];
    }
}

