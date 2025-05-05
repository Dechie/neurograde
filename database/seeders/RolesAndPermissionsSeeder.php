<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
          // Create roles
        $adminRole = Role::create(['name' => 'admin']);
        $teacherRole = Role::create(['name' => 'teacher']);
        $studentRole = Role::create(['name' => 'student']);

        // Create permissions
        $createTeacher = Permission::create(['name' => 'create teacher']);
        $createClass = Permission::create(['name' => 'create class']);
        $assignStudents = Permission::create(['name' => 'assign students']);
        $createTest = Permission::create(['name' => 'create test']);
        $reviewSubmission = Permission::create(['name' => 'review submission']);

        // Assign permissions to roles
        $adminRole->givePermissionTo([$createTeacher, $createClass, $assignStudents]);
        $teacherRole->givePermissionTo([$createTest, $reviewSubmission]);
    
    }
}

