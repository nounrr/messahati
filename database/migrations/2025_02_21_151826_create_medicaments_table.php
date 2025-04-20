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
        Schema::create('medicaments', function (Blueprint $table) {
            $table->id();
            $table->string('nom_medicament'); // SPECIALITE
            $table->string('dosage')->nullable(); // DOSAGE
            $table->string('forme')->nullable(); // FORME
            $table->string('presentation')->nullable(); // PRESENTATION
            $table->string('substance_active')->nullable(); // SUBSTANCE ACTIVE
            $table->string('classe_therapeutique')->nullable(); // CLASSE THERAPEUTIQUE
            $table->string('statut_commercialisation')->nullable(); // STATUT COMMERCIALISATION
            $table->decimal('prix_ppv', 10, 2)->nullable(); // PPV
            $table->decimal('prix_ph', 10, 2)->nullable(); // PH
            $table->decimal('prix_pfht', 15, 2)->nullable(); // PFHT
            $table->foreignId('typemedicaments_id')->constrained('type_medicaments')->onDelete('cascade');
            $table->string('img_path')->nullable(); // image si nécessaire
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medicaments');
    }
};
