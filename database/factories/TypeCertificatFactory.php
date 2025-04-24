<?php

namespace Database\Factories;

use App\Models\TypeCertificat;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TypeCertificat>
 */
class TypeCertificatFactory extends Factory
{
    protected $model = TypeCertificat::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'type_certificat' => $this->faker->unique()->randomElement([
                'Certificat médical',
                'Certificat de grossesse',
                'Certificat d\'aptitude',
                'Certificat de décès',
                'Certificat de naissance',
                'Certificat de vaccination',
                'Certificat de maladie',
                'Certificat de convalescence',
                'Certificat de handicap',
                'Certificat de santé'
            ]),
            'description' => $this->faker->paragraph,
        ];
    }
}
