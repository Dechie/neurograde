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
        Schema::create('grades', function (Blueprint $table) {
            $table->id();
            $table->foreignId("submission_id")->constrained("submissions");
            $table->foreignId("teacher_id")->constrained("teachers");
            $table->float("graded_value");
            $table->float("adjusted_grade");
            $table->enum('status', ['draft', 'published'])->default('draft');
            $table->text("comments");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('grades');
    }
};

