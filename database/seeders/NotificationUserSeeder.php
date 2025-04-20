<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\NotificationUser;

class NotificationUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        NotificationUser::insert([
            [
                'message' => 'Your appointment has been confirmed.',
                'user_id' => 1, // Assuming User with ID 1 exists
                'notification_id' => 1, // Assuming Notification with ID 1 exists
            ],
            [
                'message' => 'Your payment has been processed successfully.',
                'user_id' => 2, // Assuming User with ID 2 exists
                'notification_id' => 2, // Assuming Notification with ID 2 exists
            ],
            [
                'message' => 'Your medical report is ready for download.',
                'user_id' => 3, // Assuming User with ID 3 exists
                'notification_id' => 3, // Assuming Notification with ID 3 exists
            ],
        ]);
    }
}