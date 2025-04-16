<?php

namespace Database\Factories;

use App\Models\Partenaire;
use Illuminate\Database\Eloquent\Factories\Factory;

class PartenaireFactory extends Factory
{
    protected $model = Partenaire::class;

    public function definition()
    {
        return [
            'nom' => $this->faker->company,
            'adress' => $this->faker->address,
            'telephone' => $this->faker->phoneNumber,
            'typepartenaires_id' => \App\Models\TypePartenaire::factory(), // Assurez-vous que la relation est définie
        ];
    }
}

