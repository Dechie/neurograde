<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Test;
use App\Models\AiGradingResult;

Route::get('/', function () {
    // return Inertia::render('welcome');
    return Inertia::render('dashboard/adminDashboard/RegisterTeacher');

})->name('home');

Route::get('admin-login', function(){
    return Inertia::render('auth/admin_login');
});

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        //return Inertia::render('dashboard');
        if (auth()->user()->hasRole('admin')){
            return Inertia::render('auth/admin_login');
        } elseif (auth()->user()->hasRole("teacher")){
            return Inertia::render('dashboard');
        } elseif (auth()->user()->hasRole('student')){
            $user = auth()->user()->load('student.department');
            
            // Fetch data needed for the student dashboard
            // $upcomingTests = Test::where('status', 'upcoming')
            //     ->whereHas('departments', function($query) use ($user) {
            //         $query->where('department_id', $user->student->department_id);
            //     })
            //     ->take(5)
            //     ->get();
                
            $upcomingTests = Test::all();
            // Get recent grading results for the student
            //  $recentResults = AiGradingResult::whereHas('submission', function($query) use ($user) {
            //     $query->whereHas('test', function($testQuery) use ($user) {
            //         $testQuery->whereHas('students', function($studentQuery) use ($user) {
            //             $studentQuery->where('students.id', $user->student->id);
            //         });
            //     });
            // })
            // ->with(['submission.test'])
            // ->orderBy('created_at', 'desc')
            // ->take(5)
            // ->get();
            $recentResults = AiGradingResult::all();
                
            // Transform the results for the frontend
            $formattedResults = $recentResults->map(function($result) {
    return [
        'id' => $result->id,
        'test' => [
            'id' => $result->submission->test->id,
            'title' => (string)$result->submission->test->title,
        ],
        'score' => (float)$result->graded_value,
        'comment' => (string)$result->comment,
        // Convert metrics to a simple array if it's not already
        'metrics' => is_string($result->metrics) ? json_decode($result->metrics, true) : (array)$result->metrics,
        'submission_date' => $result->submission->submission_date instanceof \DateTime 
            ? $result->submission->submission_date->format('Y-m-d') 
            : (string)$result->submission->submission_date,
        'status' => (string)$result->submission->status,
    ];
});

            // Return the student dashboard page with necessary data
            return Inertia::render('dashboard/studentDashbord/Home', [
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->first_name . ' ' . $user->last_name,
                        'email' => $user->email,
                        'student' => [
                            'id_number' => $user->student->id_number,
                            'academic_year' => $user->student->academic_year,
                            'department' => $user->student->department->name ?? 'Unknown'
                        ]
                    ],
                    'upcomingTests' => $upcomingTests->toArray(), // Ensure this is an array
                    'recentResults' => $formattedResults->toArray(), // Ensure this is a simple array
            ]); 
        }
    })->name('dashboard');
});

// Student dashboard routes



require __DIR__.'/web-students.php';
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
