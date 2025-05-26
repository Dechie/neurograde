<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Admin;
use App\Models\ClassRoom;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;
use App\Models\Teacher;
use App\Models\Student;

class ClassRoomSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $departments = \App\Models\Department::all();
        $admin = \App\Models\Admin::first();

        foreach ($departments as $department) {
            // Create 2 classes for each department
            for ($i = 1; $i <= 2; $i++) {
                $class = ClassRoom::create([
                    'name' => "Section {$i} - {$department->name}",
                    'department_id' => $department->id,
                    'max_students' => 30,
                    'admin_id' => $admin->id,
                    'created_by' => $admin->user_id,
                ]);

                // Get teachers for this department
                $teachers = Teacher::where('department_id', $department->id)->get();
                if ($teachers->isNotEmpty()) {
                    // Assign first teacher to this class
                    $class->teachers()->attach($teachers->first()->id);
                }

                // Get assigned students for this department
                $students = Student::where('department_id', $department->id)
                    ->where('status', 'assigned')
                    ->get();

                if ($students->isNotEmpty()) {
                    if ($i === 1) {
                        // For Section 1, take the first student
                        $firstStudent = $students->first();
                        $class->students()->attach($firstStudent->id);
                        
                        // Get the second student for Section 1
                        $secondStudent = $students->skip(1)->first();
                        if ($secondStudent) {
                            $class->students()->attach($secondStudent->id);
                        }
                    } else {
                        // For Section 2, take the next two students
                        $section2Students = $students->skip(2)->take(2);
                        $class->students()->attach($section2Students->pluck('id'));
                    }
                }
            }
        }
    }
}
