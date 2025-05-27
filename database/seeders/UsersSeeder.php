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
            'email' => 'admin@email.com',
            'password' => Hash::make('password'),
        ]);
        $admin->assignRole('admin');
        $adminModel = new Admin([
            'user_id' => $admin->id,
        ]);
        $admin->admin()->save($adminModel);

        // Get departments
        $departments = Department::all();
        
        // Create teachers (1 per department)
        $teacherNames = [
            ['first' => 'Daniel', 'last' => 'Abate'],
            ['first' => 'Abel', 'last' => 'Dejene'],
            ['first' => 'Naol', 'last' => 'Feyissa']
        ];

        foreach ($departments as $index => $department) {
            $teacher = User::create([
                'first_name' => $teacherNames[$index]['first'],
                'last_name' => $teacherNames[$index]['last'],
                'email' => strtolower($teacherNames[$index]['first']) . '@email.com',
                'password' => Hash::make('password'),
            ]);
            $teacher->assignRole('teacher');

            Teacher::create([
                'user_id' => $teacher->id,
                'department_id' => $department->id,
                'created_by' => $admin->id
            ]);
        }

        // Create students (4 per department)
        $studentNames = [
            // Software Engineering Students
            ['first' => 'Hana', 'last' => 'Daniel'],
            ['first' => 'Blen', 'last' => 'Dejene'],
            ['first' => 'Sifen', 'last' => 'Feyissa'],
            ['first' => 'Ribka', 'last' => 'Abraham'],
            
            // Electrical Engineering Students
            ['first' => 'Helen', 'last' => 'Girma'],
            ['first' => 'Etsubdink', 'last' => 'Tewodros'],
            ['first' => 'Hawi', 'last' => 'Tolossa'],
            ['first' => 'Hayat', 'last' => 'Mohammed'],
            
            // Mechatronics Engineering Students
            ['first' => 'Biniam', 'last' => 'Dagnachew'],
            ['first' => 'Yonas', 'last' => 'Berihun'],
            ['first' => 'Kedir', 'last' => 'Ahmed'],
            ['first' => 'Muaz', 'last' => 'Mohammed']
        ];

        $studentIndex = 0;
        foreach ($departments as $department) {
            // Create 4 students for this department
            for ($i = 0; $i < 4; $i++) {
                $student = User::create([
                    'first_name' => $studentNames[$studentIndex]['first'],
                    'last_name' => $studentNames[$studentIndex]['last'],
                    'email' => strtolower($studentNames[$studentIndex]['first']) . '@email.com',
                    'password' => Hash::make('password'),
                ]);
                $student->assignRole('student');

                Student::create([
                    'user_id' => $student->id,
                    'department_id' => $department->id,
                    'id_number' => 'S' . ($studentIndex + 1) . '00',
                    'academic_year' => '2024',
                    'status' => $i < 3 ? 'assigned' : 'pending' // First 3 students assigned, last one pending
                ]);

                $studentIndex++;
            }
        }

        // Create unassigned students for each department
        foreach ($departments as $department) {
            for ($i = 1; $i <= 2; $i++) {
                $user = User::create([
                    'first_name' => "Unassigned{$i}",
                    'last_name' => $department->name,
                    'email' => "unassigned{$i}." . str_replace(' ', '.', strtolower($department->name)) . "@email.com",
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
            }
        }
    }
}
