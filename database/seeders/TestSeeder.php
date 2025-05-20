<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Test;
use App\Models\Teacher;
use App\Models\ClassRoom;
use Carbon\Carbon;

class TestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get a teacher and their department
        $teacher = Teacher::with('department')->first();
        
        if (!$teacher) {
            $this->command->error('No teacher found. Please run TeacherSeeder first.');
            return;
        }

        // Get a class for this teacher
        $class = $teacher->classes()->first();
        
        if (!$class) {
            $this->command->error('No class found for teacher. Please run ClassSeeder first.');
            return;
        }

        // Create some sample tests
        $tests = [
            [
                'title' => 'Introduction to Programming',
                'problem_statement' => 'Write a program to calculate the factorial of a number.',
                'due_date' => Carbon::now()->addDays(7),
                'metrics' => json_encode([
                    'correctness' => 40,
                    'efficiency' => 30,
                    'code_style' => 30
                ])
            ],
            [
                'title' => 'Data Structures',
                'problem_statement' => 'Implement a binary search tree with insert and search operations.',
                'due_date' => Carbon::now()->addDays(14),
                'metrics' => json_encode([
                    'correctness' => 50,
                    'efficiency' => 40,
                    'code_style' => 10
                ])
            ],
            [
                'title' => 'Algorithms',
                'problem_statement' => 'Implement the quicksort algorithm and analyze its time complexity.',
                'due_date' => Carbon::now()->addDays(21),
                'metrics' => json_encode([
                    'correctness' => 45,
                    'efficiency' => 45,
                    'code_style' => 10
                ])
            ]
        ];

        foreach ($tests as $testData) {
            $test = Test::create([
                'title' => $testData['title'],
                'problem_statement' => $testData['problem_statement'],
                'due_date' => $testData['due_date'],
                'teacher_id' => $teacher->id,
                'class_id' => $class->id,
                'department_id' => $teacher->department_id,
                'metrics' => $testData['metrics'],
                'status' => 'Upcoming',
                'published' => false
            ]);

            // Assign test to all students in the class
            $studentIds = $class->students()->pluck('students.id');
            $test->students()->sync($studentIds);
        }
    }
}
