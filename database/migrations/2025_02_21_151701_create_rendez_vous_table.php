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
        Schema::create('rendez_vous', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('patient_id');
            $table->unsignedBigInteger('docteur_id');
            $table->unsignedBigInteger('departement_id');
            $table->foreign('patient_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('docteur_id')->references('id')->on('users')->onDelete('cascade');
            $table->dateTime('date_heure');
            $table->foreign('departement_id')->references('id')->on('departements')->onDelete('cascade');
            $table->foreignId('traitement_id')->constrained()->onDelete('cascade');
            $table->enum('status', ['confirmé', 'annulé', 'En attente'])->default('En attente');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rendez_vous');
    }
};
