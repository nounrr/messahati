<?php

namespace Database\Factories;

use App\Models\Message;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Message>
 */
class MessageFactory extends Factory
{
    protected $model = Message::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'contenu' => $this->faker->paragraph,
            'date_envoi' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'status' => $this->faker->randomElement(['envoyé', 'lu', 'non lu']),
            'expediteur_id' => User::factory()->create(['role' => 'docteur'])->id,
            'destinataire_id' => User::factory()->create(['role' => 'patient'])->id,
        ];
    }
}
