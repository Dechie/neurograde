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
            $table->string('title');
            $table->longtext('problem_statement');
            $table->text('input_spec');
            $table->text('output_spec');
            $table->date("due_date");
            $table->enum("status", ['Upcoming', 'Done']);
            $table->foreignId("teacher_id")->constrained("teachers");
            $table->foreignId("department_id")->after('teacher_id')->constrained()->onDelete('cascade');
            $table->foreignId("class_id")->constrained("classes");
            $table->timestamp('published_at')->nullable();
            $table->boolean('published')->default(false);
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

