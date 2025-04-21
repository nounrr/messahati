<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Notification;

class NotificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Notification::insert([
            [
                'date' => '2025-04-15',
                'statut' => true,
            ],
            [
                'date' => '2025-04-16',
                'statut' => false,
            ],
            [
                'date' => '2025-04-17',
                'statut' => true,
            ],
        ]);
    }
}