<?php

// namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
// use Illuminate\Database\Seeder;
// use App\Models\User;
// use App\Models\Admin;
// use App\Models\ClassRoom;
// use Spatie\Permission\Models\Role;
// use Illuminate\Support\Facades\Hash;
// use App\Models\Teacher;
// use App\Models\Student;

// class ClassRoomSeeder extends Seeder
// {
//     /**
//      * Run the database seeds.
//      */
//     public function run(): void
//     {
//         $departments = \App\Models\Department::all();
//         $admin = \App\Models\Admin::first();

//         foreach ($departments as $department) {
//             // Create 3 classes for each department
//             for ($i = 1; $i <= 3; $i++) {
//                 $class = ClassRoom::create([
//                     'name' => "Section {$i} - {$department->name}",
//                     'department_id' => $department->id,
//                     'max_students' => 30,
//                     'admin_id' => $admin->id,
//                     'created_by' => $admin->user_id,
//                 ]);

//                 // Get teachers for this department
//                 $teachers = Teacher::where('department_id', $department->id)->get();
//                 if ($teachers->isNotEmpty()) {
//                     // Assign first teacher to this class
//                     $class->teachers()->attach($teachers->first()->id);
//                 }

//                 // Get assigned students for this department
//                 $students = Student::where('department_id', $department->id)
//                     ->where('status', 'assigned')
//                     ->get();

//                 if ($students->isNotEmpty()) {
//                     // Calculate how many students per class
//                     $studentsPerClass = ceil($students->count() / 3);
//                     // Get the chunk of students for this class
//                     $classStudents = $students->forPage($i, $studentsPerClass);
//                     // Assign students to this class
//                     $class->students()->attach($classStudents->pluck('id'));
//                 }
//             }
//         }
//     }
// }
