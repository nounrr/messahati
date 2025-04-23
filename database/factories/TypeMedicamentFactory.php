<?php

namespace Database\Factories;

use App\Models\TypeMedicament;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TypeMedicament>
 */
class TypeMedicamentFactory extends Factory
{
    protected $model = TypeMedicament::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nom' => $this->faker->unique()->randomElement([
                'Antibiotiques',
                'Analgésiques',
                'Anti-inflammatoires',
                'Antihistaminiques',
                'Antidépresseurs',
                'Anticoagulants',
                'Antidiabétiques',
                'Antihypertenseurs',
                'Antipaludiques',
                'Antiviraux'
            ]),
            'description' => $this->faker->paragraph,
        ];
    }
}
