<?php

namespace Database\Factories;

use App\Models\TypePartenaire;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TypePartenaire>
 */
class TypePartenaireFactory extends Factory
{
    protected $model = TypePartenaire::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nom' => $this->faker->randomElement([
                'Laboratoire',
                'Pharmacie',
                'Hôpital',
                'Clinique',
                'Centre de radiologie',
                'Centre d\'analyses',
                'Fournisseur de matériel médical',
                'Assurance santé',
                'Mutuelle',
                'Centre de rééducation'
            ]),
            'description' => $this->faker->paragraph,
        ];
    }
}
