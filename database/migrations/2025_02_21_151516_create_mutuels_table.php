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
        Schema::create('mutuels', function (Blueprint $table) {
            $table->id();
            $table->string('nom_mutuel');
            $table->string('code_mutuel', 20);
            $table->text('description');
            $table->date('date_creation');
            $table->decimal('taux_remboursement', 5, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mutuels');
    }
};
