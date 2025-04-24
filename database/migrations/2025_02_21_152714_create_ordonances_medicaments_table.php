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
            $table->unsignedBigInteger('ordonance_id');
            $table->unsignedBigInteger('medicament_id');

            $table->foreign('ordonance_id')->references('id')->on('ordonances')->onDelete('cascade');
            $table->foreign('medicament_id')->references('id')->on('medicaments')->onDelete('cascade');
            $table->string('dosage');
            $table->string('frequence');
            $table->string('duree');
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
