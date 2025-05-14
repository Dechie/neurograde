<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('classes', function (Blueprint $table) {
            $table->id();
            $table->string("name");
            $table->foreignId("department_id")->constrained("departments");
            $table->foreignId("teacher_id")->constrained("teachers");
            $table->foreignId("admin_id")->constrained("admins");
            $table->integer("max_students");
            $table->foreignId('created_by')->constrained('users');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('classes');
    }
};


