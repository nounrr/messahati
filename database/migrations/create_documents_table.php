<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDocumentsTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->enum('type', ['analyse', 'radio']); // 'analyse' ou 'radio'
            $table->text('description'); // Description du document
            $table->string('file_path')->nullable(); // Chemin du fichier PDF
            $table->unsignedBigInteger('traitement_id'); // Clé étrangère vers traitements
            $table->timestamps();

            // Définir la clé étrangère
            $table->foreign('traitement_id')->references('id')->on('traitements')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
}
