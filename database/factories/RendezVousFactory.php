<?php

// database/factories/RendezVousFactory.php

namespace Database\Factories;

use App\Models\User;
use App\Models\Departement;
use App\Models\Traitement;
use Illuminate\Database\Eloquent\Factories\Factory;

class RendezVousFactory extends Factory
{
    public function definition()
    {
        return [
            'patient_id' => User::inRandomOrder()->first()->id ?? User::factory(),
            'docteur_id' => User::inRandomOrder()->first()->id ?? User::factory(),
            'departement_id' => Departement::inRandomOrder()->first()->id ?? Departement::factory(),
            'traitement_id' => Traitement::inRandomOrder()->first()->id ?? Traitement::factory(),
            'date_heure' => $this->faker->dateTime(),
            'statut' => $this->faker->boolean(),
        ];
    }
}
