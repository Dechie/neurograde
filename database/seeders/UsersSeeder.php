<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Teacher;
use App\Models\Admin;
use App\Models\Student;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        // create user and assign student role
         $userStudent1 = User::create([
            'first_name' => 'Student1',
            'last_name' => 'Student1',
            'email' => 'Student1@email.com',
            'password' => Hash::make('1234'),
        ]);

        $userStudent1->assignRole('student');
        $student1 = new Student([
            'user_id' => $userStudent1->id,
            'id_number' => '000/13',
            'academic_year' => '5th',
            'department_id' => 1,
        ]);
        $userStudent1->student()->save($student1);
        $userStudent2 = User::create([
            'first_name' => 'Student2',
            'last_name' => 'Student2',
            'email' => 'Student2@email.com',
            'password' => Hash::make('1234'),
        ]);

        $userStudent2->assignRole('student');
        $student2 = new Student([
            'user_id' => $userStudent2->id,
            'id_number' => '000/13',
            'academic_year' => '5th',
            'department_id' => 1,
        ]);
        $userStudent2->student()->save($student2);

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
        $userTeacher1 = User::create([
            'first_name' => "Teacher1",
            'last_name' => "Teacher1", 
            'email' => "Teacher1@email.com",
            'password' => Hash::make("1234"), 
        ]);

        $userTeacher1->assignRole('teacher');

        $teacher1 = new Teacher([
            'user_id' => $userTeacher1->id, 
            'created_by' => 1,
            'department_id' => 1,
        ]);

        $userTeacher1->teacher()->save($teacher1);
        $userTeacher2 = User::create([
            'first_name' => "Teacher2",
            'last_name' => "Teacher2", 
            'email' => "Teacher2@email.com",
            'password' => Hash::make("1234"), 
        ]);

        $userTeacher2->assignRole('teacher');

        $teacher2 = new Teacher([
            'user_id' => $userTeacher2->id, 
            'created_by' => 1,
            'department_id' => 1,
        ]);

        $userTeacher2->teacher()->save($teacher2);


    }
}
