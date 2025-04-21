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
        Schema::create('remplacement_medicaments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('medicament_id')->constrained('medicaments')->onDelete('cascade'); // Médicament d'origine
            $table->foreignId('medicament_remplacement_id')->constrained('medicaments')->onDelete('cascade'); // Médicament de remplacement
            $table->string('raison')->nullable(); // Raison du remplacement
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('remplacement_medicaments');
    }
};
