<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Teacher;
use App\Models\Admin;
use App\Models\Student;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $this->call(RolesAndPermissionsSeeder::class);
        $this->call(DepartmentSeeder::class);



        // create user and assign student role
        $userStudent = User::create([
            'first_name' => 'Student1',
            'last_name' => 'Student1',
            'email' => 'Student1@email.com',
            'password' => Hash::make('1234'),
        ]);

        $userStudent->assignRole('student');
        $student = new Student([
            'user_id' => $userStudent->id,
            'id_number' => '000/13',
            'academic_year' => '5th',
            'department_id' => 1,
        ]);
        $userStudent->student()->save($student);

        // create user and assign admin role
        $userAdmin = User::create([
            'first_name' => "Admin1",
            'last_name' => "Admin1", 
            'email' => "Admin1@email.com",
            'password' => Hash::make("1234"), 
        ]);

        $userAdmin->assignRole('admin');

        $admin= new Admin([
            'user_id' => $userAdmin->id, 
        ]);

        $userAdmin->admin()->save($admin);

        // create user and assign teacher role
        $userTeacher = User::create([
            'first_name' => "Teacher1",
            'last_name' => "Teacher1", 
            'email' => "Teacher1@email.com",
            'password' => Hash::make("1234"), 
        ]);

        $userTeacher->assignRole('teacher');

        $teacher = new Teacher([
            'user_id' => $userTeacher->id, 
            'created_by' => 1,
            'department_id' => 1,
        ]);

        $userTeacher->teacher()->save($teacher);

        $this->call(AdminSeeder::class);
        $this->call(ClassRoomSeeder::class);
        $this->call(TestAndSubmissionSeeder::class);

        
        
    }
}


       
