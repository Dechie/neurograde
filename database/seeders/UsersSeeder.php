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

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user first
        $userAdmin = User::create([
            'first_name' => "Admin1",
            'last_name' => "Admin1", 
            'email' => "Admin1@email.com",
            'password' => Hash::make("1234"), 
        ]);

        $userAdmin->assignRole('admin');

        $admin = new Admin([
            'user_id' => $userAdmin->id, 
        ]);

        $userAdmin->admin()->save($admin);

        // Get all departments
        $departments = Department::all();
        
        // Create students for each department
        foreach ($departments as $department) {
            for ($i = 1; $i <= 5; $i++) {
                $user = User::create([
                    'first_name' => "Student{$i}",
                    'last_name' => $department->name,
                    'email' => "student{$i}." . str_replace(' ', '.', strtolower($department->name)) . "@example.com",
                    'password' => Hash::make('password'),
                ]);

                $user->assignRole('student');
                
                $student = new Student([
                    'user_id' => $user->id,
                    'id_number' => sprintf('%03d/%02d', $i, date('y')),
                    'academic_year' => '5th',
                    'department_id' => $department->id,
                ]);
                
                $user->student()->save($student);
            }
        }

        // Add a student to the first department who is not assigned to any class
        $firstDepartment = $departments->first();
        if ($firstDepartment) {
            $user = User::create([
                'first_name' => 'Unassigned',
                'last_name' => $firstDepartment->name,
                'email' => 'unassigned.' . str_replace(' ', '.', strtolower($firstDepartment->name)) . '@example.com',
                'password' => Hash::make('password'),
            ]);
            $user->assignRole('student');
            $student = new Student([
                'user_id' => $user->id,
                'id_number' => '999/99',
                'academic_year' => '5th',
                'department_id' => $firstDepartment->id,
            ]);
            $user->student()->save($student);
        }

        // Add 2/3 students to the first department who are not assigned to any class
        if ($firstDepartment) {
            for ($i = 1; $i <= 3; $i++) {
                $user = User::create([
                    'first_name' => "Unassigned{$i}",
                    'last_name' => $firstDepartment->name,
                    'email' => "unassigned{$i}." . str_replace(' ', '.', strtolower($firstDepartment->name)) . '@example.com',
                    'password' => Hash::make('password'),
                ]);
                $user->assignRole('student');
                $student = new Student([
                    'user_id' => $user->id,
                    'id_number' => sprintf('999/%02d', $i),
                    'academic_year' => '5th',
                    'department_id' => $firstDepartment->id,
                ]);
                $user->student()->save($student);
            }
        }

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
    }
}
