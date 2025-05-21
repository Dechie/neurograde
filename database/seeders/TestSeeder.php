<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Test;
use App\Models\ClassRoom;
use App\Models\Department;
use App\Models\Teacher;
use Carbon\Carbon;

class TestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get or create departments
        $csDepartment = Department::firstOrCreate(['name' => 'Computer Science']);
        $eeDepartment = Department::firstOrCreate(['name' => 'Electrical Engineering']);
        $meDepartment = Department::firstOrCreate(['name' => 'Mechanical Engineering']);

        // Get or create classes for each department
        $csClasses = [
            ClassRoom::firstOrCreate(['name' => 'CS101', 'department_id' => $csDepartment->id]),
            ClassRoom::firstOrCreate(['name' => 'CS201', 'department_id' => $csDepartment->id]),
            ClassRoom::firstOrCreate(['name' => 'CS301', 'department_id' => $csDepartment->id]),
        ];

        $eeClasses = [
            ClassRoom::firstOrCreate(['name' => 'EE101', 'department_id' => $eeDepartment->id]),
            ClassRoom::firstOrCreate(['name' => 'EE201', 'department_id' => $eeDepartment->id]),
        ];

        $meClasses = [
            ClassRoom::firstOrCreate(['name' => 'ME101', 'department_id' => $meDepartment->id]),
            ClassRoom::firstOrCreate(['name' => 'ME201', 'department_id' => $meDepartment->id]),
        ];

        // Get a teacher for each department
        $csTeacher = Teacher::whereHas('user', function($query) {
            $query->where('email', 'teacher@example.com');
        })->first();

        $eeTeacher = Teacher::whereHas('user', function($query) {
            $query->where('email', 'teacher2@example.com');
        })->first();

        $meTeacher = Teacher::whereHas('user', function($query) {
            $query->where('email', 'teacher3@example.com');
        })->first();

        // Create tests for CS classes
        foreach ($csClasses as $class) {
            Test::create([
                'title' => "Programming Assignment - {$class->name}",
                'problem_statement' => "Write a program to implement a binary search tree with the following operations:\n1. Insert\n2. Delete\n3. Search\n4. Inorder traversal",
                'due_date' => Carbon::now()->addDays(7),
                'status' => 'active',
                'teacher_id' => $csTeacher->id,
                'department_id' => $csDepartment->id,
                'class_id' => $class->id,
                'published' => true,
                'metrics' => [
                    'time_limit' => 2,
                    'memory_limit' => 256,
                    'test_cases' => 5
                ]
            ]);

            Test::create([
                'title' => "Data Structures Quiz - {$class->name}",
                'problem_statement' => "Implement a stack using arrays and perform the following operations:\n1. Push\n2. Pop\n3. Peek\n4. IsEmpty",
                'due_date' => Carbon::now()->addDays(14),
                'status' => 'active',
                'teacher_id' => $csTeacher->id,
                'department_id' => $csDepartment->id,
                'class_id' => $class->id,
                'published' => true,
                'metrics' => [
                    'time_limit' => 1,
                    'memory_limit' => 128,
                    'test_cases' => 3
                ]
            ]);
        }

        // Create tests for EE classes
        foreach ($eeClasses as $class) {
            Test::create([
                'title' => "Circuit Analysis - {$class->name}",
                'problem_statement' => "Analyze the given circuit and calculate:\n1. Total resistance\n2. Current through each branch\n3. Voltage across each component",
                'due_date' => Carbon::now()->addDays(10),
                'status' => 'active',
                'teacher_id' => $eeTeacher->id,
                'department_id' => $eeDepartment->id,
                'class_id' => $class->id,
                'published' => true,
                'metrics' => [
                    'time_limit' => 3,
                    'memory_limit' => 512,
                    'test_cases' => 4
                ]
            ]);
        }

        // Create tests for ME classes
        foreach ($meClasses as $class) {
            Test::create([
                'title' => "Thermodynamics Problem - {$class->name}",
                'problem_statement' => "Solve the following thermodynamics problems:\n1. Calculate heat transfer\n2. Determine work done\n3. Find efficiency",
                'due_date' => Carbon::now()->addDays(12),
                'status' => 'active',
                'teacher_id' => $meTeacher->id,
                'department_id' => $meDepartment->id,
                'class_id' => $class->id,
                'published' => true,
                'metrics' => [
                    'time_limit' => 2,
                    'memory_limit' => 256,
                    'test_cases' => 4
                ]
            ]);
        }
    }
}
