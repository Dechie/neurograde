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

        $tests = [
            Test::factory()->create([
                'title' => 'Palindrome',
                'status' => 'Done',
                'due_date' => '2025-05-09',
            ]),
            Test::factory()->create([
                'title' => 'Binary Search',
                'status' => 'Done',
                'due_date' => '2025-05-10',
            ]),
            Test::factory()->create([
                'title' => 'Quick Sort',
                'status' => 'Done',
                'due_date' => '2025-05-11',
            ])
        ];

        for ($i = 1; $i <= 8; $i++) {
            $test = Test::factory()->create([
                'teacher_id' => 1, 
                'class_id' => 1, 
                'title' => 'Palindrome',
                'status' => 'Done',
                'due_date' => '2025-05-09',
            ]);

            // Temporarily commenting out submissions
            /*
            Submission::factory()->create([
                'test_id' => $test->id,
                'student_id' => $student->id,
                'submission_type' => 'editor',
                'code_editor_text' => 'def is_palindrome(s): return s == s[::-1]',
                'submission_date' => fake()->dateTimeBetween('now', '+2 weeks')->format('Y-m-d'), // ✅ CORRECT
                'status' => 'graded',
            ]);
            */
        }
    }
}
