<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\TypeTraitement;
use App\Models\TypeMedicament;
use App\Models\Departement;
use App\Models\User;
use App\Models\Traitement;
use App\Models\Medicament;
use App\Models\Ordonance;
use App\Models\RendezVous;
use App\Models\Payment;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class DatabaseSeeder extends Seeder
{                                                                        
    public function run(): void
    {
        $this->call([
            RolesAndPermissionsSeeder::class,
            DepartementSeeder::class,
            TypeMedicamentSeeder::class,
            TypeTraitementSeeder::class,
            UserSeeder::class,
            TraitementSeeder::class,
            RendezVousTestSeeder::class,
            MedicamentSeeder::class,
            OrdonanceSeeder::class,
            PaymentSeeder::class,
        ]);
    }
}
