<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\AiGradingResult;
use App\Models\Test;

class DashboardRedirectController extends Controller
{
    //
    public function redirectToDashboard() {
        if (auth()->user()->hasRole('admin')){
            return Inertia::render('dashboard/adminDashboard/StudentListPage');
        } elseif (auth()->user()->hasRole("teacher")){
            return Inertia::render('dashboard/teacherDashboard/CreateExam');
        } elseif (auth()->user()->hasRole('student')){
            $user = auth()->user()->load(['student.department', 'student.classes']);
            
            // Check if student is pending
            if ($user->student->status === 'pending') {
                return redirect()->route('student.waiting');
            }

            // Get the student's first class
            $class = $user->student->classes->first();
            
            if (!$class) {
                return Inertia::render('dashboard/studentDashboard/Home', [
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->first_name . ' ' . $user->last_name,
                        'email' => $user->email,
                        'student' => [
                            'id_number' => $user->student->id_number,
                            'academic_year' => $user->student->academic_year,
                            'department' => $user->student->department->name ?? 'Unknown',
                            'class' => null,
                        ]
                    ],
                    'upcomingTests' => [],
                    'recentResults' => [],
                    'statistics' => [
                        'total_tests' => 0,
                        'completed_tests' => 0,
                        'pending_submissions' => 0,
                        'average_score' => 0,
                    ],
                ]);
            }
                
            // Get tests for student's class that are not past due date
            $tests = Test::where('class_id', $class->id)
                ->where('published', true)
                ->where('due_date', '>', now())
                ->with([
                    'class.department',
                    'teacher.user',
                    'submissions' => function($query) use ($user) {
                        $query->where('student_id', $user->student->id);
                    }
                ])
                ->get();

            \Log::info('Tests query', [
                'class_id' => $class->id,
                'count' => $tests->count(),
                'tests' => $tests->map(function($test) {
                    return [
                        'id' => $test->id,
                        'title' => $test->title,
                        'due_date' => $test->due_date,
                        'published' => $test->published,
                        'submissions_count' => $test->submissions->count()
                    ];
                })->toArray()
            ]);

            // Filter out tests that the student has already submitted
            $upcomingTests = $tests->filter(function($test) {
                return $test->submissions->isEmpty();
            })->map(function($test) {
                return [
                    'id' => $test->id,
                    'title' => $test->title,
                    'due_date' => $test->due_date->format('Y-m-d H:i:s'),
                    'class_name' => $test->class->name,
                ];
            })->values();

            \Log::info('Filtered upcoming tests', [
                'count' => $upcomingTests->count(),
                'tests' => $upcomingTests->toArray()
            ]);
            
            $recentResults = AiGradingResult::whereHas('submission', function($query) use ($user) {
                    $query->where('student_id', $user->student->id);
                })
                ->with(['submission.test'])
                ->get();
                
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

            // Calculate statistics
            $statistics = [
                'total_tests' => $upcomingTests->count(),
                'completed_tests' => $recentResults->count() ?? 0,
                'pending_submissions' => $tests->filter(function($test) {
                    return !$test->submissions->isEmpty() && $test->submissions->first()->status === 'pending';
                })->count() ?? 0,
                'average_score' => round($recentResults->avg('graded_value') ?? 0, 1),
            ];

            // Return the student dashboard page with necessary data
            return Inertia::render('dashboard/studentDashboard/Home', [
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->first_name . ' ' . $user->last_name,
                        'email' => $user->email,
                        'student' => [
                            'id_number' => $user->student->id_number,
                            'academic_year' => $user->student->academic_year,
                            'department' => $user->student->department->name ?? 'Unknown',
                            'class' => $class ? [
                                'name' => $class->name,
                                'department' => $class->department->name,
                            ] : null,
                        ]
                    ],
                    'upcomingTests' => $upcomingTests->toArray(),
                    'recentResults' => $formattedResults->toArray(),
                    'statistics' => $statistics,
            ]); 
        }
    }
}
