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
        Schema::create('ai_grading_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('submission_id')->constrained()->onDelete('cascade');
            $table->integer('predicted_id');
            $table->string('predicted_verdict_string');
            $table->json('verdict_probabilities');
            $table->string('requested_language');
            $table->text('code_submission');
            $table->text('problem_statement');
            $table->text('input_spec')->nullable();
            $table->text('output_spec')->nullable();
            $table->text('llm_review')->nullable();
            $table->json('metrics')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ai_grading_results');
    }
};
