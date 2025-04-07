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
        Schema::create('user_mutuels', function (Blueprint $table) {
            $table->id();
        
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('mutuel_id')->constrained('mutuels')->onDelete('cascade');
        
            $table->string('numero_police')->nullable(); // Numéro de contrat mutuelle
            $table->string('numero_carte')->nullable(); // N° carte mutuelle
            $table->string('lien_assure')->nullable(); // ex: assuré, enfant, conjoint
            $table->date('date_validite')->nullable();
            $table->integer('pourcentage_prise_en_charge')->default(100);
            $table->timestamps();
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_mutuels');
    }
};
