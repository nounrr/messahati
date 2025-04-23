<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('medicaments', function (Blueprint $table) {
            $table->date('date_expiration')->nullable()->after('classe_therapeutique');
            $table->integer('quantite')->default(0)->after('date_expiration');
            $table->decimal('prix_unitaire', 10, 2)->nullable()->after('quantite');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('medicaments', function (Blueprint $table) {
            $table->dropColumn(['date_expiration', 'quantite', 'prix_unitaire']);
        });
    }
}; 