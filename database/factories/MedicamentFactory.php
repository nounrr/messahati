<?php

namespace Database\Factories;

use App\Models\Medicament;
use App\Models\TypeMedicament;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Medicament>
 */
class MedicamentFactory extends Factory
{
    protected $model = Medicament::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nom_medicament' => $this->faker->unique()->word,
            'dosage' => $this->faker->randomElement(['500mg', '250mg', '1000mg', '750mg']),
            'forme' => $this->faker->randomElement(['Comprimé', 'Gélule', 'Sirop', 'Injection']),
            'substance_active' => $this->faker->word,
            'classe_therapeutique' => $this->faker->word,
            'conditionnement' => $this->faker->randomElement(['Boîte de 30', 'Boîte de 60', 'Flacon de 100ml']),
            'code_cip' => $this->faker->unique()->numerify('34009########'),
            'laboratoire' => $this->faker->company,
            'indications' => $this->faker->paragraph,
            'contre_indications' => $this->faker->paragraph,
            'effets_indesirables' => $this->faker->paragraph,
            'interactions' => $this->faker->paragraph,
            'precautions' => $this->faker->paragraph,
            'posologie' => $this->faker->paragraph,
            'mode_administration' => $this->faker->randomElement(['Oral', 'Intraveineux', 'Intramusculaire']),
            'surdosage' => $this->faker->paragraph,
            'conservation' => $this->faker->paragraph,
            'prix' => $this->faker->randomFloat(2, 5, 100),
            'quantite' => $this->faker->numberBetween(10, 1000),
            'date_expiration' => $this->faker->dateTimeBetween('now', '+2 years'),
            'typemedicaments_id' => TypeMedicament::factory()->create()->id,
            'img_path' => $this->faker->imageUrl(640, 480, 'medicament'),
            'remplacement' => $this->faker->boolean,
        ];
    }
}
