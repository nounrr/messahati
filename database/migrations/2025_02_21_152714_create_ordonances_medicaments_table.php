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
        Schema::create('ordonances_medicaments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_ordonance')->constrained('ordonances')->onDelete('cascade');
            $table->foreignId('id_medicament')->constrained('medicaments')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ordonances_medicaments');
    }
};
