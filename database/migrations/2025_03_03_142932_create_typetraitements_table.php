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
        Schema::create('typetraitements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('traitement_id')->constrained()->onDelete('cascade');
            $table->string('nom');
            $table->float('prix-default');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('typetraitements');
    }
};
