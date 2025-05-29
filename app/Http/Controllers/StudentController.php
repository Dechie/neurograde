<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use App\Models\Test;
use App\Models\AiGradingResult;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Validator;
use App\Models\Submission;
use App\Services\AiGradingService;
use App\Jobs\GradeSubmission;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use App\Traits\SanitizesMarkdown;

class StudentController extends Controller
{
    use SanitizesMarkdown;

    protected $aiGradingService;

    public function __construct(AiGradingService $aiGradingService)
    {
        $this->aiGradingService = $aiGradingService;
    }

    public function getResults(): InertiaResponse // Change the type hint here
    {
        $user = auth()->user()->load('student');
        $student = $user->student;

        // Fetch submissions with their related data
        $submissions = Submission::where('student_id', $student->id)
            ->with([
                'test',
                'grades' => function($query) {
                    $query->latest();
                },
                'aiGradingResults' => function($query) {
                    $query->latest();
                }
            ])
            ->orderBy('created_at', 'desc')
            ->get();

        // Format the results for the frontend
        $formattedResults = $submissions->map(function($submission) {
            $latestAiResult = $submission->aiGradingResults->first();
            $latestGrade = $submission->grades->first();
            
            return [
                'id' => $submission->id,
                'test' => [
                    'id' => $submission->test->id,
                    'title' => $submission->test->title,
                ],
                'score' => $submission->status === 'published' ? $submission->final_grade : null,
                'comment' => $latestGrade ? $latestGrade->comments : null,
                'metrics' => $latestAiResult ? json_decode($latestAiResult->metrics, true) : null,
                'submission_date' => $submission->created_at->format('Y-m-d H:i:s'),
                'status' => $submission->status,
            ];
        })->toArray();

        return Inertia::render('dashboard/studentDashboard/Results', [
            'results' => $formattedResults
        ]);
    }

    /**
     * Show the student tests list page.
     */
    public function getTests(): Response
    {
        $user = auth()->user()->load('student');
        $student = $user->student;

        // Get tests assigned to this student that are published
        $tests = $student->tests()
            ->where('published', true)
            ->where('due_date', '>', now())
            ->with(['class.department', 'teacher.user'])
            ->orderBy('due_date', 'asc')
            ->get()
            ->map(function($test) {
                return [
                    'id' => $test->id,
                    'title' => $test->title,
                    'problemStatement' => $test->problem_statement,
                    'input_spec' => $test->input_spec,
                    'output_spec' => $test->output_spec,
                    'dueDate' => $test->due_date ? $test->due_date->format('Y-m-d H:i:s') : null,
                    'status' => $test->status,
                    'class' => $test->class ? [
                        'id' => $test->class->id,
                        'name' => $test->class->name,
                        'department' => $test->class->department->name
                    ] : null,
                    'teacher' => $test->teacher ? [
                        'id' => $test->teacher->id,
                        'name' => $test->teacher->user->first_name . ' ' . $test->teacher->user->last_name
                    ] : null
                ];
            });

        return Inertia::render('dashboard/studentDashboard/Tests/Index', [
            'tests' => $tests
        ]);
    }

    /**
     * Show a specific test page for a student.
     */
    public function showTest($testId)
    {
        $student = auth()->user()->student;
        
        $test = Test::whereHas('students', function($query) use ($student) {
            $query->where('students.id', $student->id);
        })
        ->with(['class.department', 'teacher'])
        ->findOrFail($testId);

        $submission = $test->submissions()
            ->where('student_id', $student->id)
            ->first();

        return Inertia::render('dashboard/studentDashboard/Tests/TestDetail', [
            'test' => [
                'id' => $test->id,
                'title' => $test->title,
                'problemStatement' => $test->problem_statement,
                'input_spec' => $test->input_spec,
                'output_spec' => $test->output_spec,
                'dueDate' => $test->due_date,
                'status' => $test->status,
                'questionId' => $test->id,
                'initialCode' => $test->initial_code ?? '',
                'class_id' => $test->class_id,
                'department_id' => $test->department_id,
                'class' => [
                    'id' => $test->class->id,
                    'name' => $test->class->name,
                    'department' => $test->class->department->name,
                ],
                'department' => [
                    'id' => $test->department->id,
                    'name' => $test->department->name,
                ],
                'teacher' => [
                    'name' => $test->teacher->user->first_name . ' ' . $test->teacher->user->last_name,
                ],
            ],
            'submission' => $submission ? [
                'id' => $submission->id,
                'status' => $submission->status,
                'created_at' => $submission->created_at,
            ] : null,
        ]);
    }

    public function showTests()
    {
        $student = auth()->user()->student;
        
        // Get the student's first class
        $class = $student->classes->first();
        
        if (!$class) {
            return Inertia::render('dashboard/studentDashboard/Tests/Index', [
                'tests' => []
            ]);
        }
        
        // Get tests for student's class that are not past due date
        $tests = Test::where('class_id', $class->id)
            ->where('due_date', '>', now())
            ->with([
                'class.department',
                'teacher.user',
                'submissions' => function($query) use ($student) {
                    $query->where('student_id', $student->id);
                }
            ])
            ->get();

        return Inertia::render('dashboard/studentDashboard/Tests/Index', [
            'tests' => $tests
        ]);
    }

    public function submitTest(Request $request, $id)
    {
        try {
            $student = auth()->user()->student;
            
            // Load the student's class and department relationships
            $student->load(['classes', 'department']);
            
            // Get the test
            $test = Test::findOrFail($id);
            
            // Validate student's access to the test
            if (!$student->classes->contains('id', $test->class_id)) {
                return back()->with('error', 'You are not enrolled in the class for this test.');
            }
            
            if ($student->department_id !== $test->department_id) {
                return back()->with('error', 'You are not in the department for this test.');
            }

            // Check if student has already submitted
            $existingSubmission = Submission::where('student_id', $student->id)
                ->where('test_id', $test->id)
                ->first();

            if ($existingSubmission) {
                return back()->with('error', 'You have already submitted this test.');
            }

            // Validate the submission based on type
            $validator = Validator::make($request->all(), [
                'submission_type' => 'required|in:file,editor',
                'code_editor_text' => 'required_if:submission_type,editor|string',
                'code_file' => 'required_if:submission_type,file|nullable|file|mimes:cpp,h,hpp,c,py|max:1024',
                'language' => 'required|in:cpp,python',
            ]);

            if ($validator->fails()) {
                Log::error('Validation failed', [
                    'errors' => $validator->errors()->toArray(),
                    'request_data' => $request->all()
                ]);
                return back()->withErrors($validator->errors());
            }

            // Create the submission
            $submission = Submission::create([
                'student_id' => $student->id,
                'test_id' => $test->id,
                'submission_type' => $request->submission_type,
                'code_editor_text' => null,
                'code_file_path' => null,
                'language' => $request->language,
                'submission_date' => now(),
                'status' => 'pending'
            ]);

            // Handle the submission based on type
            if ($request->submission_type === 'editor') {
                $submission->update([
                    'code_editor_text' => $this->sanitizeMarkdown($request->code_editor_text)
                ]);
            } else if ($request->submission_type === 'file') {
                if (!$request->hasFile('code_file')) {
                    return back()->with('error', 'Please upload a code file for file submission.');
                }
                $file = $request->file('code_file');
                $path = $file->store('submissions/' . $submission->id);
                $submission->update([
                    'code_file_path' => $path,
                    'code_editor_text' => $this->sanitizeMarkdown(file_get_contents($file->getRealPath()))
                ]);
            }

            // Dispatch the grading job
            GradeSubmission::dispatch($submission);

            Log::info('Test submitted successfully', [
                'submission_id' => $submission->id,
                'test_id' => $test->id,
                'student_id' => $student->id,
                'submission_type' => $request->submission_type,
                'language' => $request->language,
                'has_file' => $request->hasFile('code_file'),
                'has_editor_text' => !empty($request->code_editor_text)
            ]);

            return back()->with('success', 'Test submitted successfully! Your submission is being graded.');

        } catch (\Exception $e) {
            Log::error('Failed to submit test', [
                'error' => $e->getMessage(),
                'test_id' => $id,
                'student_id' => auth()->user()->student->id,
                'trace' => $e->getTraceAsString()
            ]);

            return back()->with('error', 'Failed to submit test. Please try again.');
        }
    }

    public function checkStatus()
    {
        $student = auth()->user()->student;
        
        // Get the assigned class from the pivot table where assigned is true
        // Because of unique('student_id') on class_students, first() should work correctly for the single assigned class.
        $assignedClass = $student->classes()->wherePivot('assigned', true)->first();
        
        // A student is considered assigned if their status is 'assigned' AND there's an assigned class entry in the pivot table
        $isAssigned = $student->status === 'assigned' && $assignedClass;
        
        if ($isAssigned) {
            return Inertia::render('WaitingScreen', [
                'status' => 'success',
                'message' => 'You have been assigned to a class! Redirecting to dashboard...',
                'assignedClassId' => $assignedClass->id,   // Pass the class ID to the frontend
                'assignedClassName' => $assignedClass->name, // Pass the class name to the frontend
            ]);
        }
        
        return Inertia::render('WaitingScreen', [
            'status' => 'info',
            'message' => 'Your account is still pending assignment. Please wait while an administrator assigns you to a class.'
        ]);
    }

    public function dashboard(): InertiaResponse|RedirectResponse
    {
        $student = auth()->user()->student;
        
        // Get the assigned class from the pivot table
        $assignedClass = $student->classes()->wherePivot('assigned', true)->first();
        $isAssigned = $student->status === 'assigned' && $assignedClass;

        if (!$isAssigned) {
            \Log::warning('Unauthorized dashboard access attempt', [
                'student_id' => $student->id,
                'status' => $student->status,
                'has_assigned_class' => (bool)$assignedClass,
                'reason' => $student->status !== 'assigned' ? 'Status not assigned' : 'No assigned class in pivot',
            ]);
            return redirect()->route('student.waiting');
        }
        
        \Log::info('Student data', [
            'student_id' => $student->id,
            'assigned_class_id' => $assignedClass ? $assignedClass->id : null,
            'department_id' => $student->department_id
        ]);

        // Get tests for student's assigned class that are not past due date
        $tests = $assignedClass ? Test::where('class_id', $assignedClass->id)
            ->where('published', true)
            ->where('due_date', '>', now())
            ->with([
                'class.department',
                'teacher.user',
                'submissions' => function($query) use ($student) {
                    $query->where('student_id', $student->id);
                }
            ])
            ->get() : collect();

        \Log::info('Initial tests query', [
            'count' => $tests->count(),
            'tests' => $tests->map(function($test) {
                return [
                    'id' => $test->id,
                    'title' => $test->title,
                    'class_id' => $test->class_id,
                    'due_date' => $test->due_date,
                    'published' => $test->published,
                    'submissions_count' => $test->submissions->count()
                ];
            })->toArray()
        ]);

        // Filter out tests that the student has already submitted
        $upcomingTests = $tests->filter(function($test) {
            $isEmpty = $test->submissions->isEmpty();
            \Log::info('Test submission check', [
                'test_id' => $test->id,
                'has_submissions' => !$isEmpty,
                'submissions_count' => $test->submissions->count()
            ]);
            return $isEmpty;
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

        // Get all submissions for this student
        $submissions = Submission::where('student_id', $student->id)
            ->with(['test', 'aiGradingResults'])
            ->get();

        \Log::info('Student submissions', [
            'count' => $submissions->count(),
            'submissions' => $submissions->map(function($submission) {
                return [
                    'id' => $submission->id,
                    'test_id' => $submission->test_id,
                    'status' => $submission->status
                ];
            })->toArray()
        ]);

        // Calculate statistics with default values
        $statistics = [
            'total_tests' => $tests->count() ?? 0,
            'completed_tests' => $submissions->where('status', '!=', 'pending')->count() ?? 0,
            'pending_submissions' => $submissions->where('status', 'pending')->count() ?? 0,
            'average_score' => round($submissions
                ->where('status', 'published')
                ->avg('final_grade') ?? 0, 1),
        ];

        // Get recent results (last 5 submissions)
        $recentResults = $submissions
            ->sortByDesc('created_at')
            ->take(5)
            ->map(function($submission) {
                return [
                    'id' => $submission->id,
                    'test' => [
                        'title' => $submission->test->title,
                    ],
                    'score' => $submission->final_grade,
                    'status' => $submission->status,
                    'submission_date' => $submission->created_at->format('Y-m-d H:i:s'),
                ];
            })
            ->values();

        return Inertia::render('dashboard/studentDashboard/Home', [
            'user' => [
                'id' => $student->id,
                'name' => $student->user->first_name . ' ' . $student->user->last_name,
                'email' => $student->user->email,
                'student' => [
                    'id_number' => $student->id_number,
                    'academic_year' => $student->academic_year,
                    'department' => $student->department->name,
                    'class' => $assignedClass ? [
                        'name' => $assignedClass->name,
                        'department' => $assignedClass->department->name,
                    ] : null,
                ],
            ],
            'upcomingTests' => $upcomingTests,
            'recentResults' => $recentResults,
            'statistics' => $statistics,
        ]);
    }

    public function showWaitingScreen()
    {
        $student = auth()->user()->student;
        
        // Log comprehensive waiting screen access information
        Log::info('Student waiting screen access', [
            'student_id' => $student->id,
            'user_id' => auth()->id(),
            'status' => $student->status,
            'class_id' => $student->class_id,
            'has_class' => $student->class_id !== null,
            'session_id' => session()->getId(),
            'csrf_token' => request()->session()->token(),
            'is_authenticated' => auth()->check(),
            'roles' => auth()->user()->roles->pluck('name'),
            'request_method' => request()->method(),
            'request_path' => request()->path(),
            'request_ip' => request()->ip(),
            'user_agent' => request()->userAgent()
        ]);
        
        // Check both status and pivot table assigned flag
        $isAssigned = $student->status === 'assigned' && 
                     $student->class_id && 
                     $student->classes()
                            ->where('class_id', $student->class_id)
                            ->wherePivot('assigned', true)
                            ->exists();

        if ($isAssigned) {
            Log::info('Student is assigned, redirecting to dashboard', [
                'student_id' => $student->id,
                'class_id' => $student->class_id,
                'has_assigned_pivot' => true
            ]);
            return redirect()->route('student.dashboard');
        }

        return Inertia::render('WaitingScreen', [
            'status' => 'info',
            'message' => 'Your account is still pending assignment. Please wait while an administrator assigns you to a class.'
        ]);
    }

    public function index()
    {
        $student = auth()->user()->student;
        
        // Get upcoming tests with submission status
        $upcomingTests = Test::whereHas('class', function($query) use ($student) {
            $query->whereHas('students', function($q) use ($student) {
                $q->where('students.id', $student->id);
            });
        })
        ->where('published', true)
        ->where('due_date', '>', now())
        ->with([
            'class.department',
            'teacher.user',
            'submissions' => function($query) use ($student) {
                $query->where('student_id', $student->id);
            }
        ])
        ->orderBy('due_date', 'asc')
        ->get()
        ->map(function($test) {
            return [
                'id' => $test->id,
                'title' => $test->title,
                'due_date' => $test->due_date->format('Y-m-d H:i:s'),
                'class_name' => $test->class->name,
                'department' => $test->class->department->name,
                'has_submitted' => $test->submissions->isNotEmpty()
            ];
        });

        // Get recent results
        $recentResults = $student->submissions()
            ->with(['test', 'grades' => function($query) {
                $query->latest();
            }])
            ->latest()
            ->take(5)
            ->get()
            ->map(function($submission) {
                $latestGrade = $submission->grades->first();
                return [
                    'id' => $submission->id,
                    'test' => [
                        'id' => $submission->test->id,
                        'title' => $submission->test->title
                    ],
                    'status' => $submission->status,
                    'score' => $latestGrade ? $latestGrade->graded_value : null,
                    'submission_date' => $submission->submission_date,
                    'comment' => $latestGrade ? $latestGrade->comments : null
                ];
            });

        // Calculate statistics
        $statistics = [
            'total_tests' => $student->tests()->count(),
            'completed_tests' => $student->submissions()->count(),
            'pending_submissions' => $student->tests()->whereDoesntHave('submissions', function($query) use ($student) {
                $query->where('student_id', $student->id);
            })->count(),
            'average_score' => $student->submissions()
                ->whereHas('grades')
                ->with('grades')
                ->get()
                ->avg(function($submission) {
                    return $submission->grades->first()?->graded_value ?? 0;
                })
        ];

        // Add debug logging
        \Log::info('Student class data', [
            'student_id' => $student->id,
            'classes' => $student->classes->pluck('id'),
            'upcoming_tests_count' => $upcomingTests->count(),
            'upcoming_tests' => $upcomingTests->toArray()
        ]);

        return Inertia::render('dashboard/studentDashboard/Home', [
            'user' => [
                'name' => auth()->user()->first_name . ' ' . auth()->user()->last_name,
                'student' => [
                    'id_number' => $student->id_number
                ]
            ],
            'upcomingTests' => $upcomingTests,
            'recentResults' => $recentResults,
            'statistics' => $statistics
        ]);
    }
}