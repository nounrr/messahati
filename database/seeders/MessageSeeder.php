<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Message;

class MessageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Message::insert([
            [
                'destinataire_id' => 1, // Assuming User with ID 1 exists
                'emetteure_id' => 2, // Assuming User with ID 2 exists
                'contenu' => 'Bonjour, avez-vous reçu les documents ?',
                'date_envoie' => '2025-04-15',
                'heure_envoie' => '10:30:00',
                'status' => true,
            ],
            [
                'destinataire_id' => 2, // Assuming User with ID 2 exists
                'emetteure_id' => 1, // Assuming User with ID 1 exists
                'contenu' => 'Oui, merci beaucoup !',
                'date_envoie' => '2025-04-15',
                'heure_envoie' => '10:45:00',
                'status' => true,
            ],
            [
                'destinataire_id' => 3, // Assuming User with ID 3 exists
                'emetteure_id' => 1, // Assuming User with ID 1 exists
                'contenu' => 'Pouvez-vous confirmer notre rendez-vous ?',
                'date_envoie' => '2025-04-16',
                'heure_envoie' => '14:00:00',
                'status' => false,
            ],
        ]);
    }
}