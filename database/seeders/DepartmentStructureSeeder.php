<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Department;
use App\Models\ClassRoom;
use App\Models\Student;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class DepartmentStructureSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all departments
        $departments = Department::all();

        foreach ($departments as $department) {
            // Create 4 students for each department
            $students = [];
            for ($i = 1; $i <= 4; $i++) {
                $user = User::create([
                    'first_name' => "Student{$i}",
                    'last_name' => $department->name,
                    'email' => "student{$i}.{$department->name}@example.com",
                    'password' => Hash::make('password'),
                ]);
                $user->assignRole('student');

                $student = Student::create([
                    'user_id' => $user->id,
                    'department_id' => $department->id,
                    'id_number' => "STU" . $i . $department->id,
                    'academic_year' => '2023-2024',
                ]);

                $students[] = $student;
            }

            // Create 2 classes for each department
            for ($i = 1; $i <= 2; $i++) {
                $class = ClassRoom::create([
                    'name' => "Class {$i} - {$department->name}",
                    'department_id' => $department->id,
                    'admin_id' => 1,
                    'max_students' => 30,
                    'created_by' => 1,
                ]);

                // Assign 2 students to each section of the class
                // First 2 students (section A) to first class
                if ($i === 1) {
                    $class->students()->attach($students[0]->id);
                    $class->students()->attach($students[1]->id);
                }
                // Last 2 students (section B) to second class
                else {
                    $class->students()->attach($students[2]->id);
                    $class->students()->attach($students[3]->id);
                }
            }
        }
    }
}
