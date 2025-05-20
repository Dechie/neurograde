<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Student;

// Get total students count
$totalStudents = Student::count();
echo "Total students: " . $totalStudents . "\n";

// Get unassigned students count
$unassignedStudents = Student::whereDoesntHave('classes')->count();
echo "Unassigned students: " . $unassignedStudents . "\n";

// Get unassigned students details
$unassignedStudentsDetails = Student::whereDoesntHave('classes')
    ->with(['user', 'department'])
    ->get();

echo "\nUnassigned students details:\n";
foreach ($unassignedStudentsDetails as $student) {
    echo sprintf(
        "ID: %d, Name: %s %s, Department: %s\n",
        $student->id,
        $student->user->first_name,
        $student->user->last_name,
        $student->department->name
    );
} 