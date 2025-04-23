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
        Schema::table('ordonances_medicaments', function (Blueprint $table) {
            $table->string('posologie')->nullable()->after('medicament_id');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ordonances_medicaments', function (Blueprint $table) {
            $table->dropColumn('posologie');
            $table->dropTimestamps();
        });
    }
}; 