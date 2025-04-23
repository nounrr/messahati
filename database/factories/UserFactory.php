<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\Departement;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $departementIds = Departement::pluck('id')->toArray();
        
        return [
            'cin' => strtoupper(fake()->bothify('??######')),
            'name' => fake()->lastName(),
            'prenom' => fake()->firstName(),
            'email' => fake()->unique()->safeEmail(),
            'sexe' => fake()->randomElement(['Homme', 'Femme']),
            'telephone' => fake()->phoneNumber(),
            'adresse' => fake()->address(),
            'date_naissance' => now(),
            'departement_id' => fake()->randomElement($departementIds),
            'password' => Hash::make('password'),
            'img_path' => 'default.png',
            'status' => fake()->randomElement(['congé', 'absent', 'actif', 'inactif']), 
            'status_maladie' => fake()->boolean(),




            
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
