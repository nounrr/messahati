<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Payment;

class PaymentSeeder extends Seeder
{
    public function run()
    {
        Payment::insert([
            ['rendez_vous_id' => 1, 'montant' => 100.00, 'date' => now(), 'status' => true, 'payment_method' => 'espece'],
            ['rendez_vous_id' => 2, 'montant' => 200.00, 'date' => now(), 'status' => false, 'payment_method' => 'carte-bancaire'],
        ]);
    }
}