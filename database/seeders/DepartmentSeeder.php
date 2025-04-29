<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Department;
class DepartmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $department1 = Department::create(["name" => "Software Engineering"]);
        $department2 = Department::create(["name" => "Electrical Engineering"]);
        $department3 = Department::create(["name" => "Mechatronics Engineering"]);
    }
}
