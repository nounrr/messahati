<?php

namespace Database\Factories;

use App\Models\Mutuel;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Mutuel>
 */
class MutuelFactory extends Factory
{
    protected $model = Mutuel::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nom_mutuel' => $this->faker->company,
            
        ];
    }
}
