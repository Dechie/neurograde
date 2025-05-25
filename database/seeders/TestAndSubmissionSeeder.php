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
        $seTeacher = Teacher::firstOrCreate(
            ['user_id' => User::where('email', 'daniel@email.com')->first()->id],
            ['department_id' => $seDepartment->id]
        );
        $eeTeacher = Teacher::firstOrCreate(
            ['user_id' => User::where('email', 'naol@email.com')->first()->id],
            ['department_id' => $eeDepartment->id]
        );

        $mechatronicsTeacher = Teacher::firstOrCreate(
            ['user_id' => User::where('email', 'abel@email.com')->first()->id],
            ['department_id' => $mechatronicsDepartment->id]
        );

        

        // Create tests for EE classes
        foreach ($eeClasses as $class) {
            Test::create([
                'title' => "Dynamic Programming - {$class->name}",
                'problem_statement' => "Given an array of integers, find the length of the longest increasing subsequence (LIS).\n\nInput Format:\n- First line contains N, size of array\n- Second line contains N space-separated integers\n\nOutput Format:\n- Print the length of the longest increasing subsequence\n\nConstraints:\n- 1 ≤ N ≤ 10^5\n- -10^9 ≤ arr[i] ≤ 10^9\n\nExample:\nInput:\n5\n10 9 2 5 3\n\nOutput:\n3\n\nExplanation: The longest increasing subsequence is [2, 5, 3] with length 3.",
                'due_date' => Carbon::now()->addDays(7),
                'input_spec' => 'example input spec',
                'output_spec' => 'example output spec',
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
                'input_spec' => 'example input spec',
                'output_spec' => 'example output spec',
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
                'input_spec' => 'example input spec',
                'output_spec' => 'example output spec',
                'teacher_id' => $mechatronicsTeacher->id,
                'department_id' => $mechatronicsDepartment->id,
                'class_id' => $class->id,
                'published' => true
            ]);

            Test::create([
                'title' => "Tree Traversal - {$class->name}",
                'problem_statement' => "Given a binary tree, implement level order traversal and find the maximum width of the tree.\n\nInput Format:\n- First line contains N, number of nodes\n- Next N lines contain node values in level order (use -1 for null)\n\nOutput Format:\n- Print the level order traversal\n- Print the maximum width\n\nConstraints:\n- 1 ≤ N ≤ 10^5\n- -10^9 ≤ node value ≤ 10^9\n\nExample:\nInput:\n7\n1 2 3 4 5 -1 7\n\nOutput:\n1 2 3 4 5 7\n4",
                'due_date' => Carbon::now()->addDays(14),
                'input_spec' => 'example input spec',
                'output_spec' => 'example output spec',
                'status' => 'Upcoming',
                'teacher_id' => $mechatronicsTeacher->id,
                'department_id' => $mechatronicsDepartment->id,
                'class_id' => $class->id,
                'published' => true
            ]);
        }

        // Create tests for SE classes
        // foreach ($seClasses as $class) {
        //     Test::create([
        //         'title' => "Greatest Common Divisor - {$class->name}",
        //         "problem_statement" => "## Greatest Common Divisor\nWrite a program which finds the greatest common divisor of two natural numbers a and b\n\n## Input\na and b are given in a line sparated by a single space.\n\n## Output\nOutput the greatest common divisor of a and b.\n\n## Constrants\n1 ≤ a, b ≤ 109\n\n## Hint\nYou can use the following observation:\n\nFor integers x and y, if x ≥ y, then gcd(x, y) = gcd(y, x%y)\n\n## Sample Input 1\n```\n54 20\n```\n\n## Sample Output 1\n```\n2\n```\n\n## Sample Input 2\n```\n147 105\n```\n\n## Sample Output 2\n```\n21\n```",
        //         'due_date' => Carbon::now()->addDays(7),
        //         'status' => 'Upcoming',
        //         'input_spec' => 'example input spec',
        //         'output_spec' => 'example output spec',
        //         'teacher_id' => $seTeacher->id,
        //         'department_id' => $seDepartment->id,
        //         'class_id' => $class->id,
        //         'published' => true
        //     ]);

        //     Test::create([
        //         'title' => "Largest Square - {$class->name}",
        //         "problem_statement" => "# Largest Square\nGiven a matrix (H × W) which contains only 1 and 0, find the area of the largest square matrix which only contains 0s.\n\n## Input\n```\nH W\nc1,1 c1,2 ... c1,W\nc2,1 c2,2 ... c2,W\n:\ncH,1 cH,2 ... cH,W\n```\n\nIn the first line, two integers H and W separated by a space character are given. In the following H lines, ci,j, elements of the H × W matrix, are given.\n\n## Output\nPrint the area (the number of 0s) of the largest square.\n\n## Constraints\n- 1 ≤ H, W ≤ 1,400\n## Sample Input\n```\n4 5\n0 0 1 0 0\n1 0 0 0 0\n0 0 0 1 0\n0 0 0 1 0\n```\n\n## Sample Output\n```\n4\n```", 
        //         'due_date' => Carbon::now()->addDays(14),
        //         'status' => 'Upcoming',
        //         'input_spec' => 'example input spec',
        //         'output_spec' => 'example output spec',
        //         'teacher_id' => $seTeacher->id,
        //         'department_id' => $seDepartment->id,
        //         'class_id' => $class->id,
        //         'published' => true
        //     ]);
        // }
    }
}
