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
        Schema::create('submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId("test_id")->constrained("tests");
            $table->foreignId("student_id")->constrained("students");
            // $table->foreignId("submission_id")->constrained("submissions");
            $table->enum("submission_type", ["file", "editor"]);
            $table->string("code_file_path")->nullable();
            $table->text("code_editor_text")->nullable();
            $table->date("submission_date");
            $table->enum("status", ["pending", "reviewed", "graded"]);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('submissions');
    }
};

