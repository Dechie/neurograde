<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Department;
use App\Models\ClassRoom;
use App\Models\User;

class DepartmentStructureSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create departments
        $departments = [
            ['name' => 'Computer Science'],
            ['name' => 'Electrical Engineering'],
            ['name' => 'Mechanical Engineering'],
        ];

        foreach ($departments as $dept) {
            Department::create($dept);
        }

        // Create classes for each department
        $departments = Department::all();
        $adminId = User::whereHas('roles', function($query) {
            $query->where('name', 'admin');
        })->first()->id;

        foreach ($departments as $department) {
            for ($i = 1; $i <= 3; $i++) {
                ClassRoom::create([
                    'name' => "Class {$i}",
                    'department_id' => $department->id,
                    'admin_id' => $adminId,
                    'max_students' => 30,
                    'created_by' => $adminId
                ]);
            }
        }
    }
}
