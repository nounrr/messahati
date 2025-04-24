<?php

namespace Database\Factories;

use App\Models\CertificatMedicale;
use App\Models\User;
use App\Models\TypeCertificat;
use App\Models\Traitement;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CertificatMedicale>
 */
class CertificatMedicaleFactory extends Factory
{
    protected $model = CertificatMedicale::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'date_emission' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'description' => $this->faker->paragraph,
            'patient_id' => User::factory()->create(['role' => 'patient'])->id,
            'docteur_id' => User::factory()->create(['role' => 'docteur'])->id,
            'type_certificat_id' => TypeCertificat::factory(),
            'traitement_id' => Traitement::factory(),
        ];
    }
}
