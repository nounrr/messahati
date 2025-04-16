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
        Schema::create('medicaments', function (Blueprint $table) {
            $table->id();
            $table->string('nom_medicament');
            $table->integer('quantite')->nullable();
            $table->date('date_expiration')->nullable();
            $table->foreignId('typemedicaments_id')->references('id')->on('type_medicaments')->onDelete('cascade');
            $table->decimal('prix_unitaire', 8, 2)->nullable();
            $table->string('img_path')->nullable();
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
