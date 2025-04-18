<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Clinique;

class CliniqueSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Clinique::insert([
            [
                'nom' => 'Clinique Santé Plus',
                'adresse' => '123 Rue de la Santé, Paris',
                'email' => 'contact@santeplus.fr',
                'site_web' => 'https://www.santeplus.fr',
                'description' => 'Une clinique spécialisée dans les soins généraux et la médecine préventive.',
                'logo_path' => null,
            ],
            [
                'nom' => 'Clinique Bien-Être',
                'adresse' => '456 Avenue du Bien-Être, Lyon',
                'email' => 'info@bienetre.fr',
                'site_web' => 'https://www.bienetre.fr',
                'description' => 'Clinique offrant des services de bien-être et de réhabilitation.',
                'logo_path' => null,
            ],
            [
                'nom' => 'Clinique Premium',
                'adresse' => '789 Boulevard Premium, Marseille',
                'email' => 'support@premium.fr',
                'site_web' => 'https://www.premium.fr',
                'description' => 'Clinique haut de gamme avec des services spécialisés.',
                'logo_path' => null,
            ],
        ]);
    }
}