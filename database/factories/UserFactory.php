<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use App\Models\Departement;
use Carbon\Carbon;

class UserFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $date_naissance = $this->faker->dateTimeBetween('-80 years', '-18 years')->format('Y-m-d');
        
        return [
            'cin' => strtoupper($this->faker->bothify('??######')),
            'name' => $this->faker->lastName(),
            'prenom' => $this->faker->firstName(),
            'sexe' => $this->faker->randomElement(['femme', 'homme']),
            'Age' => Carbon::parse($date_naissance)->age,
            'email' => $this->faker->unique()->safeEmail(),
            'telephone' => $this->faker->phoneNumber(),
            'adresse' => $this->faker->address(),
            'date_naissance' => $date_naissance,
            'departement_id' => Departement::inRandomOrder()->first()->id ?? Departement::factory(),
            'password' => Hash::make('password'), // ou bcrypt('password')
            'img_path' => 'default.png',
            'status' => $this->faker->boolean(),
            'status_maladie' => $this->faker->boolean(),
            'email_verified_at' => now(),
            'remember_token' => \Str::random(10),
        ];
    }

    /**
     * Indique un email non vérifié.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
