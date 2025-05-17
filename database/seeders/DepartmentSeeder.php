<?php

namespace Database\Seeders;

use App\Models\Department;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $departments = [
            ['name' => 'Software Engineering'],
            ['name' => 'Computer Science'],
            ['name' => 'Electrical Engineering'],
            ['name' => 'Mechatronics Engineering']
        ];

        foreach ($departments as $department) {
            Department::create($department);
        }
    }
}

