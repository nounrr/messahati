<?php

namespace Database\Factories;

use App\Models\Partenaire;
use App\Models\TypePartenaire;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Partenaire>
 */
class PartenaireFactory extends Factory
{
    protected $model = Partenaire::class;

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

            'telephone' => $this->faker->phoneNumber,
            'email' => $this->faker->unique()->companyEmail,
            
            'typepartenaires_id' => TypePartenaire::factory(),
            'img_path' => $this->faker->imageUrl(640, 480, 'partner'),
        ];
    }
}
