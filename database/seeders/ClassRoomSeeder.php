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
            // Create 3 classes for each department
            for ($i = 1; $i <= 3; $i++) {
                $class = ClassRoom::create([
                    'name' => "Section {$i} - {$department->name}",
                    'department_id' => $department->id,
                    'max_students' => 30,
                    'admin_id' => $admin->id,
                    'created_by' => $admin->user_id,
                ]);

                // Get teachers for this department
                $teachers = \App\Models\Teacher::where('department_id', $department->id)->get();
                if ($teachers->isNotEmpty()) {
                    // Assign first teacher to this class
                    $class->teachers()->attach($teachers->first()->id);
                }

                // Get students for this department and distribute them across classes
                $students = \App\Models\Student::where('department_id', $department->id)->get();
                if ($students->isNotEmpty()) {
                    // Only assign 80% of students to classes
                    $studentsToAssign = $students->take(ceil($students->count() * 0.8));
                    // Calculate how many students per class
                    $studentsPerClass = ceil($studentsToAssign->count() / 3);
                    // Get the chunk of students for this class
                    $classStudents = $studentsToAssign->forPage($i, $studentsPerClass);
                    // Assign students to this class
                    $class->students()->attach($classStudents->pluck('id'));
                }
            }
        }
    }
}
