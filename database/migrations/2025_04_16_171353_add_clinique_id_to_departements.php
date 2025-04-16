<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('departements', function (Blueprint $table) {
            $table->foreignId('clinique_id')->after('id')->constrained('cliniques')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::table('departements', function (Blueprint $table) {
            $table->dropForeign(['clinique_id']);
            $table->dropColumn('clinique_id');
        });
    }
}; 