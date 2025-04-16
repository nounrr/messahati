<?php

// database/factories/DepartementFactory.php
namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class DepartementFactory extends Factory
{
    public function definition()
    {
        return [
            'nom' => $this->faker->word(),
        ];
    }
}
