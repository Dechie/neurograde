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
            // Foreign key linking to the students table
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            // Foreign key linking to the tests table
            $table->foreignId('test_id')->constrained('tests')->cascadeOnDelete();
            // Column to store the submission type (file or editor)
            $table->enum('submission_type', ['file', 'editor']);
            $table->enum('language', ['cpp', 'python'])->nullable();
            // Column to store the file path if a file is uploaded
            $table->string('code_file_path')->nullable();
            // Column to store submitted code directly (if text submission is allowed)
            $table->longText('code_editor_text')->nullable();
            // Submission date
            $table->date('submission_date');
            // Status of the submission (e.g., Pending, Reviewed, Graded)
            $table->enum('status', ['pending', 'reviewed', 'graded'])->default('pending');
            // Ensure a student can only submit once per test
            $table->unique(['student_id', 'test_id']);
            $table->timestamps(); // created_at and updated_at
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
