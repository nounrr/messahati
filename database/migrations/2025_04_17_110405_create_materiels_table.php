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
        Schema::create('materiels', function (Blueprint $table) {
            $table->id();
            $table->foreignId('clinique_id')->constrained('cliniques')->onDelete('cascade');
            $table->string('libelle');
            $table->integer('quantite');
            $table->boolean('status');//le materiel utilise ou il reste dans stock
            $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('_materiels');
    }
};
