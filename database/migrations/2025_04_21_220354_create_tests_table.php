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
        Schema::create('tests', function (Blueprint $table) {
            $table->id();
            $table->foreignId("teacher_id")->contstrained("teachers");
            $table->foreignId("student_id")->contstrained("students");
            $table->foreignId("class_id")->contstrained("classes");
            $table->string("title");
            $table->text("problem_statement");
            $table->enum("status", ['Upcoming', 'Done']);
            $table->date("due_date");
            $table->json("metrics");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tests');
    }
};
