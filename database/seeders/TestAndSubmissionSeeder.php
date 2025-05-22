<?php

namespace Database\Seeders;
// database/seeders/TestAndSubmissionSeeder.php
use App\Models\Test;
use App\Models\Submission;
use App\Models\User;
use App\Models\Teacher;
use App\Models\Student;
use Illuminate\Database\Seeder;
use App\Models\ClassRoom;
use App\Models\Department;
use Carbon\Carbon;

class TestAndSubmissionSeeder extends Seeder
{
    public function run(): void
    {
        // Get or create departments
        $eeDepartment = Department::firstOrCreate(['name' => 'Electrical Engineering']);
        $mechatronicsDepartment = Department::firstOrCreate(['name' => 'Mechatronics Engineering']);
        $seDepartment = Department::firstOrCreate(['name' => 'Software Engineering']);

        // Get admin for class creation
        $admin = \App\Models\Admin::first();

        // Get or create classes for each department
        $eeClasses = [
            ClassRoom::firstOrCreate(
                ['name' => 'EE101', 'department_id' => $eeDepartment->id],
                ['admin_id' => $admin->id, 'max_students' => 30, 'created_by' => $admin->user_id]
            ),
            ClassRoom::firstOrCreate(
                ['name' => 'EE201', 'department_id' => $eeDepartment->id],
                ['admin_id' => $admin->id, 'max_students' => 30, 'created_by' => $admin->user_id]
            ),
        ];

        $mechatronicsClasses = [
            ClassRoom::firstOrCreate(
                ['name' => 'ME101', 'department_id' => $mechatronicsDepartment->id],
                ['admin_id' => $admin->id, 'max_students' => 30, 'created_by' => $admin->user_id]
            ),
            ClassRoom::firstOrCreate(
                ['name' => 'ME201', 'department_id' => $mechatronicsDepartment->id],
                ['admin_id' => $admin->id, 'max_students' => 30, 'created_by' => $admin->user_id]
            ),
        ];

        $seClasses = [
            ClassRoom::firstOrCreate(
                ['name' => 'SE101', 'department_id' => $seDepartment->id],
                ['admin_id' => $admin->id, 'max_students' => 30, 'created_by' => $admin->user_id]
            ),
            ClassRoom::firstOrCreate(
                ['name' => 'SE201', 'department_id' => $seDepartment->id],
                ['admin_id' => $admin->id, 'max_students' => 30, 'created_by' => $admin->user_id]
            ),
        ];

        // Get or create teachers for each department
        $eeTeacher = Teacher::firstOrCreate(
            ['user_id' => User::where('email', 'daniel@example.com')->first()->id],
            ['department_id' => $eeDepartment->id]
        );

        $mechatronicsTeacher = Teacher::firstOrCreate(
            ['user_id' => User::where('email', 'abel@example.com')->first()->id],
            ['department_id' => $mechatronicsDepartment->id]
        );

        $seTeacher = Teacher::firstOrCreate(
            ['user_id' => User::where('email', 'naol@example.com')->first()->id],
            ['department_id' => $seDepartment->id]
        );

        // Create tests for EE classes
        foreach ($eeClasses as $class) {
            Test::create([
                'title' => "Dynamic Programming - {$class->name}",
                'problem_statement' => "Given an array of integers, find the length of the longest increasing subsequence (LIS).\n\nInput Format:\n- First line contains N, size of array\n- Second line contains N space-separated integers\n\nOutput Format:\n- Print the length of the longest increasing subsequence\n\nConstraints:\n- 1 ≤ N ≤ 10^5\n- -10^9 ≤ arr[i] ≤ 10^9\n\nExample:\nInput:\n5\n10 9 2 5 3\n\nOutput:\n3\n\nExplanation: The longest increasing subsequence is [2, 5, 3] with length 3.",
                'due_date' => Carbon::now()->addDays(7),
                'status' => 'Upcoming',
                'teacher_id' => $eeTeacher->id,
                'department_id' => $eeDepartment->id,
                'class_id' => $class->id,
                'published' => true
            ]);

            Test::create([
                'title' => "Graph Algorithms - {$class->name}",
                'problem_statement' => "Given a directed graph with N nodes and M edges, find the shortest path between two nodes using Dijkstra's algorithm.\n\nInput Format:\n- First line contains N (nodes) and M (edges)\n- Next M lines contain edges (u v w) where w is weight\n- Last line contains source and destination nodes\n\nOutput Format:\n- Print the shortest path length\n- Print the path if it exists, otherwise print -1\n\nConstraints:\n- 1 ≤ N ≤ 10^5\n- 1 ≤ M ≤ 2*10^5\n- 1 ≤ w ≤ 10^9\n\nExample:\nInput:\n5 6\n1 2 2\n2 3 3\n3 4 1\n4 5 4\n1 3 5\n2 4 2\n1 5\n\nOutput:\n7\n1 2 4 5",
                'due_date' => Carbon::now()->addDays(14),
                'status' => 'Upcoming',
                'teacher_id' => $eeTeacher->id,
                'department_id' => $eeDepartment->id,
                'class_id' => $class->id,
                'published' => true
            ]);
        }

        // Create tests for Mechatronics classes
        foreach ($mechatronicsClasses as $class) {
            Test::create([
                'title' => "Binary Search - {$class->name}",
                'problem_statement' => "Given a sorted array of integers and a target value, find the first and last position of the target in the array.\n\nInput Format:\n- First line contains N, size of array\n- Second line contains N space-separated integers\n- Third line contains target value\n\nOutput Format:\n- Print two integers: first and last position of target\n- If target not found, print -1 -1\n\nConstraints:\n- 1 ≤ N ≤ 10^5\n- -10^9 ≤ arr[i] ≤ 10^9\n\nExample:\nInput:\n6\n5 7 7 8 8 10\n8\n\nOutput:\n3 4",
                'due_date' => Carbon::now()->addDays(7),
                'status' => 'Upcoming',
                'teacher_id' => $mechatronicsTeacher->id,
                'department_id' => $mechatronicsDepartment->id,
                'class_id' => $class->id,
                'published' => true
            ]);

            Test::create([
                'title' => "Tree Traversal - {$class->name}",
                'problem_statement' => "Given a binary tree, implement level order traversal and find the maximum width of the tree.\n\nInput Format:\n- First line contains N, number of nodes\n- Next N lines contain node values in level order (use -1 for null)\n\nOutput Format:\n- Print the level order traversal\n- Print the maximum width\n\nConstraints:\n- 1 ≤ N ≤ 10^5\n- -10^9 ≤ node value ≤ 10^9\n\nExample:\nInput:\n7\n1 2 3 4 5 -1 7\n\nOutput:\n1 2 3 4 5 7\n4",
                'due_date' => Carbon::now()->addDays(14),
                'status' => 'Upcoming',
                'teacher_id' => $mechatronicsTeacher->id,
                'department_id' => $mechatronicsDepartment->id,
                'class_id' => $class->id,
                'published' => true
            ]);
        }

        // Create tests for SE classes
        foreach ($seClasses as $class) {
            Test::create([
                'title' => "String Manipulation - {$class->name}",
                'problem_statement' => "Given a string, find the longest palindromic substring.\n\nInput Format:\n- First line contains string S\n\nOutput Format:\n- Print the longest palindromic substring\n\nConstraints:\n- 1 ≤ |S| ≤ 1000\n- S contains only lowercase English letters\n\nExample:\nInput:\nbabad\n\nOutput:\nbab",
                'due_date' => Carbon::now()->addDays(7),
                'status' => 'Upcoming',
                'teacher_id' => $seTeacher->id,
                'department_id' => $seDepartment->id,
                'class_id' => $class->id,
                'published' => true
            ]);

            Test::create([
                'title' => "Array Operations - {$class->name}",
                'problem_statement' => "Given an array of integers, find the maximum sum of a contiguous subarray.\n\nInput Format:\n- First line contains N, size of array\n- Second line contains N space-separated integers\n\nOutput Format:\n- Print the maximum sum\n\nConstraints:\n- 1 ≤ N ≤ 10^5\n- -10^9 ≤ arr[i] ≤ 10^9\n\nExample:\nInput:\n5\n-2 1 -3 4 -1\n\nOutput:\n4\n\nExplanation: The subarray [4] has the maximum sum of 4.",
                'due_date' => Carbon::now()->addDays(14),
                'status' => 'Upcoming',
                'teacher_id' => $seTeacher->id,
                'department_id' => $seDepartment->id,
                'class_id' => $class->id,
                'published' => true
            ]);
        }
    }
}
