<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pharmacie_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('medicament_id')->constrained('medicaments')->onDelete('cascade'); // Clé étrangère vers medicaments
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // Clé étrangère vers users
            $table->boolean('payment')->default(false); // Champ pour indiquer si le paiement est effectué
            $table->enum('statut', ['en cours', 'done', 'en attente'])->default('en attente'); // Statut de la commande
            $table->integer('quantite')->default(1); // Quantité de médicaments
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pharmacie_user');
    }
};
