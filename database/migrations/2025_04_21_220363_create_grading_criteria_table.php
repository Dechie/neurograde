<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('grading_criteria', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('description');
            $table->integer('verdict_id')->unique();
            $table->timestamps();
        });

        // Insert the default grading criteria
        DB::table('grading_criteria')->insert([
            ['name' => 'Accepted', 'description' => 'The solution is correct and meets all requirements', 'verdict_id' => 0],
            ['name' => 'Wrong Answer', 'description' => 'The solution produces incorrect output', 'verdict_id' => 1],
            ['name' => 'Time Limit Exceeded', 'description' => 'The solution takes too long to execute', 'verdict_id' => 2],
            ['name' => 'Memory Limit Exceeded', 'description' => 'The solution uses too much memory', 'verdict_id' => 3],
            ['name' => 'Runtime Error', 'description' => 'The solution crashes during execution', 'verdict_id' => 4],
            ['name' => 'Compile Error', 'description' => 'The solution fails to compile', 'verdict_id' => 5],
            ['name' => 'Presentation Error', 'description' => 'The solution output format is incorrect', 'verdict_id' => 6],
            ['name' => 'Unknown Verdict', 'description' => 'The verdict could not be determined', 'verdict_id' => -1],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('grading_criteria');
    }
}; 