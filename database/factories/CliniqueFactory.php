<?php

namespace Database\Factories;

use App\Models\Clinique;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Clinique>
 */
class CliniqueFactory extends Factory
{
    protected $model = Clinique::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nom' => $this->faker->company,
            'adresse' => $this->faker->address,
            'site_web' => $this->faker->url,
            'email' => $this->faker->unique()->companyEmail,
            'description' => $this->faker->paragraph,
            'logo_path' => $this->faker->imageUrl(640, 480, 'clinic'),
        ];
    }
}
