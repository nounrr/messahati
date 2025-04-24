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
        Schema::create('ordonances', function (Blueprint $table) {
            $table->id();
            $table->date('date_expiration');
            $table->unsignedBigInteger('patient_id');
            $table->unsignedBigInteger('docteur_id');

            $table->foreign('patient_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('docteur_id')->references('id')->on('users')->onDelete('cascade');
            
            $table->text('description')->nullable();
            $table->foreignId('traitement_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ordonances');
    }
};
