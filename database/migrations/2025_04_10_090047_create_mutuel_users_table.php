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
        Schema::create('mutuel_users', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mutuel_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('numero_police')->nullable();
            $table->string('numero_carte')->nullable();
            $table->string('lien_assure')->nullable();
            $table->date('date_validite')->nullable();
            $table->decimal('pourcentage_prise_en_charge',4,2)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mutuel_users');
    }
};
