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
            [
                'name' => 'Electrical Engineering'
            ],
            [
                'name' => 'Software Engineering'
            ],
            [
                'name' => 'Mechatronics Engineering'
            ]
        ];

        foreach ($departments as $department) {
            $dept = Department::create($department);

            // Create 2 sections for each department
            for ($i = 1; $i <= 2; $i++) {
                ClassRoom::create([
                    'name' => "Section {$i}",
                    'department_id' => $dept->id,
                    'admin_id' => 1,
                    'max_students' => 30,
                    'created_by' => 1
                ]);
            }
        }
    }
}
