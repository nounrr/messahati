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
        Schema::create('certificats_medicale', function (Blueprint $table) {
            $table->id();
            $table->text('description');
            $table->date('date_emission');
            $table->foreignId('typecertificat_id')->constrained()->onDelete('cascade');
            $table->foreignId('traitement_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('certificats_medicale');
    }
};
