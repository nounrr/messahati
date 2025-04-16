<?php

namespace Database\Factories;

use App\Models\TypePartenaire;
use Illuminate\Database\Eloquent\Factories\Factory;

class TypePartenaireFactory extends Factory
{
    protected $model = TypePartenaire::class;

    public function definition()
    {
        return [
            'nom' => $this->faker->word, // Un nom aléatoire pour le type
            'description' => $this->faker->sentence, // Une description aléatoire
        ];
    }
}

