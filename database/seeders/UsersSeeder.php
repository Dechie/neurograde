<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Teacher;
use App\Models\Admin;
use App\Models\Student;
use App\Models\Department;
use App\Models\ClassRoom;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        $admin = User::create([
            'first_name' => 'Admin',
            'last_name' => 'User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
        ]);
        $admin->assignRole('admin');
        $adminModel = new Admin([
            'user_id' => $admin->id,
        ]);
        $admin->admin()->save($adminModel);

        // Get all departments
        $departments = Department::all();
        
        // Create teachers for each department
        foreach ($departments as $department) {
            for ($i = 1; $i <= 2; $i++) {
                $user = User::create([
                    'first_name' => "Teacher{$i}",
                    'last_name' => $department->name,
                    'email' => "teacher{$i}." . str_replace(' ', '.', strtolower($department->name)) . "@example.com",
                    'password' => Hash::make('password'),
                ]);

                $user->assignRole('teacher');

                $teacher = new Teacher([
                    'user_id' => $user->id,
                    'created_by' => $admin->id,
                    'department_id' => $department->id,
                ]);

                $user->teacher()->save($teacher);
            }
        }

        // Create students for each class (assigned)
        $classes = ClassRoom::all();
        foreach ($classes as $class) {
            for ($i = 1; $i <= 5; $i++) {
                $user = User::create([
                    'first_name' => "Student{$i}",
                    'last_name' => $class->name,
                    'email' => "student{$i}." . str_replace(' ', '.', strtolower($class->name)) . "@example.com",
                    'password' => Hash::make('password'),
                ]);
                $user->assignRole('student');
                $student = new Student([
                    'user_id' => $user->id,
                    'id_number' => sprintf('S%d-%d', $class->id, $i),
                    'academic_year' => '5th',
                    'department_id' => $class->department_id,
                    'status' => 'assigned',
                ]);
                $user->student()->save($student);
                $class->students()->attach($student->id);
            }
        }

        // Create unassigned students for each department
        foreach ($departments as $department) {
            for ($i = 1; $i <= 2; $i++) {
                $user = User::create([
                    'first_name' => "Unassigned{$i}",
                    'last_name' => $department->name,
                    'email' => "unassigned{$i}." . str_replace(' ', '.', strtolower($department->name)) . "@example.com",
                    'password' => Hash::make('password'),
                ]);
                $user->assignRole('student');
                $student = new Student([
                    'user_id' => $user->id,
                    'id_number' => sprintf('U%d-%d', $department->id, $i),
                    'academic_year' => '5th',
                    'department_id' => $department->id,
                    'status' => 'pending',
                ]);
                $user->student()->save($student);
                // Not attached to any class
            }
        }

        // Create students
        $students = [
            [
                'first_name' => 'John',
                'last_name' => 'Doe',
                'email' => 'john@example.com',
                'password' => Hash::make('password'),
                'id_number' => '001/25',
                'academic_year' => '5th',
                'department_id' => 2
            ],
            [
                'first_name' => 'Jane',
                'last_name' => 'Smith',
                'email' => 'jane@example.com',
                'password' => Hash::make('password'),
                'id_number' => '002/25',
                'academic_year' => '4th',
                'department_id' => 1
            ],
            [
                'first_name' => 'Mike',
                'last_name' => 'Johnson',
                'email' => 'mike@example.com',
                'password' => Hash::make('password'),
                'id_number' => '003/25',
                'academic_year' => '3rd',
                'department_id' => 2
            ]
        ];
    }
}
