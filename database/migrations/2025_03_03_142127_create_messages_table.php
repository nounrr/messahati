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
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('destinataire_id');
            $table->unsignedBigInteger('emetteure_id');
            $table->foreign('destinataire_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('emetteure_id')->references('id')->on('users')->onDelet('cascade');
            $table->string('contenu');
            $table->date('date_envoie');
            $table->time('heure_envoie');
            $table->boolean('status');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
