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
        Schema::table('payments', function (Blueprint $table) {
            // Supprimer la colonne payment_method
            $table->dropColumn('payment_method');
            
            // Rendre montant et date nullable
            $table->float('montant')->nullable()->change();
            $table->date('date')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            // Ajouter à nouveau la colonne payment_method
            $table->enum('payment_method', ['espece', 'carte-bancaire', 'cheque'])->default('espece');
            
            // Remettre montant et date comme non nullable
            $table->float('montant')->nullable(false)->change();
            $table->date('date')->nullable(false)->change();
        });
    }
}; 