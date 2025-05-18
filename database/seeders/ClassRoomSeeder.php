<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Admin;
use App\Models\ClassRoom;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;
class ClassRoomSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $class1 = ClassRoom::create([
            'name' => 'Section A',
            'department_id' => 1,  
            'teacher_id' => 1,
            'max_students' => 10,
            'admin_id' => 1,
            'created_by' => 1,
        ]);
         
    }
}
