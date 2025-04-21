<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([

            // TypeTraitementSeeder::class,
            // MutuelSeeder::class,
            // CliniqueSeeder::class,
            // RolesAndPermissionsSeeder::class,
            // DepartementSeeder::class,
            UserSeeder::class,    // UserSeeder runs after DepartementSeeder
            // TraitementSeeder::class,
            // RendezVousSeeder::class,
            // ReclamationSeeder::class,
            NotificationSeeder::class,
            OrdonanceSeeder::class,
            TypeMedicamentSeeder::class,
            MedicamentSeeder::class,
            TypeCertificatSeeder::class,
            CertificatMedicaleSeeder::class,
            OrdonanceMedicamentSeeder::class,
            PaymentSeeder::class,
            FeedbackSeeder::class,
            TacheSeeder::class,
            AuditLogCliniqueSeeder::class,
            TypePartenaireSeeder::class,
            PartenaireSeeder::class,
            MessageSeeder::class,
            MutuelUserSeeder::class,
            NotificationUserSeeder::class,
            AttachementSeeder::class,
            UserTacheSeeder::class,
            ChargeSeeder::class,
            SalaireSeeder::class,
            ModelHasPermissionSeeder::class,

        ]);
    }
}
