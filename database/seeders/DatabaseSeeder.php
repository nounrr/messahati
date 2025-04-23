<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Database\Seeders\UserSeeder;
use Database\Seeders\TypeTraitementSeeder;
use Database\Seeders\MutuelSeeder;
use Database\Seeders\CliniqueSeeder;
use Database\Seeders\RolesAndPermissionsSeeder;
use Database\Seeders\DepartementSeeder;
use Database\Seeders\TraitementSeeder;
use Database\Seeders\RendezVousSeeder;
use Database\Seeders\ReclamationSeeder;
use Database\Seeders\NotificationSeeder;
use Database\Seeders\OrdonanceSeeder;
use Database\Seeders\TypeMedicamentSeeder;
use Database\Seeders\MedicamentSeeder;
use Database\Seeders\TypeCertificatSeeder;
use Database\Seeders\CertificatMedicaleSeeder;
use Database\Seeders\OrdonanceMedicamentSeeder;
use Database\Seeders\PaymentSeeder;
use Database\Seeders\FeedbackSeeder;
use Database\Seeders\TacheSeeder;
use Database\Seeders\AuditLogCliniqueSeeder;
use Database\Seeders\TypePartenaireSeeder;
use Database\Seeders\PartenaireSeeder;
use Database\Seeders\MessageSeeder;
use Database\Seeders\MutuelUserSeeder;
use Database\Seeders\NotificationUserSeeder;
use Database\Seeders\AttachementSeeder;
use Database\Seeders\UserTacheSeeder;
use Database\Seeders\ChargeSeeder;
use Database\Seeders\SalaireSeeder;
use Database\Seeders\VenteSeeder;
use Database\Seeders\MaterielSeeder;
use Database\Seeders\StatistiquesSeeder;
use Database\Seeders\StatistiquesDataSeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $this->call([
            TypeTraitementSeeder::class,
            MutuelSeeder::class,
            CliniqueSeeder::class,
            RolesAndPermissionsSeeder::class,
            DepartementSeeder::class,
            StatistiquesSeeder::class,
            UserSeeder::class,
            TraitementSeeder::class,
            RendezVousSeeder::class,
            ReclamationSeeder::class,
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
            VenteSeeder::class,
            MaterielSeeder::class,
            StatistiquesDataSeeder::class,
        ]);
    }
}