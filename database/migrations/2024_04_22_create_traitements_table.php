<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('traitements', function (Blueprint $table) {
            $table->renameColumn('typetraitement_id', 'type_traitement_id');
        });
    }

    public function down()
    {
        Schema::table('traitements', function (Blueprint $table) {
            $table->renameColumn('type_traitement_id', 'typetraitement_id');
        });
    }
}; 