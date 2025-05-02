<?php

namespace Database\Seeders;
// database/seeders/TestAndSubmissionSeeder.php
use App\Models\Test;
use App\Models\Submission;
use App\Models\User;
use App\Models\Teacher;
use App\Models\Student;
use Illuminate\Database\Seeder;

class TestAndSubmissionSeeder extends Seeder
{
    public function run(): void
    {
        $teacher = Teacher::first(); // Or select a specific one
        $student = Student::first(); // Same here

        for ($i = 1; $i <= 8; $i++) {
            $test = Test::factory()->create([
                'teacher_id' => 1, 
                'student_id' => $i <= 3 ? $i : 1,
                'class_id' => 1, // Make sure a class with id=1 exists
                'title' => 'Palindrome',
                'status' => 'Done',
                'due_date' => '2025-05-09',
            ]);

            Submission::factory()->create([
                'test_id' => $test->id,
                'submission_id' => $test->id, // Adjust depending on your schema
                'submission_type' => 'editor',
                'code_editor_text' => 'def is_palindrome(s): return s == s[::-1]',
                'submission_date' => fake()->dateTimeBetween('now', '+2 weeks')->format('Y-m-d'), // ✅ CORRECT
                'status' => 'graded',
            ]);
        }
    }
}
