<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Teacher;
use App\Models\Admin;
use App\Models\Student;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $this->call([
            RolesAndPermissionsSeeder::class,
            DepartmentSeeder::class,
            UsersSeeder::class,
            AdminSeeder::class,
            ClassRoomSeeder::class,
            TestAndSubmissionSeeder::class,
            TestSeeder::class,
            DepartmentStructureSeeder::class,
        ]);
    }
}


       
