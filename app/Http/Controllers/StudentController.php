<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response; 
use App\Models\Test;
use App\Models\AiGradingResult;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Validator;
use App\Models\Submission;
use App\Services\AiGradingService;
use App\Jobs\GradeSubmission;
use Illuminate\Support\Facades\Log;

class StudentController extends Controller
{
    protected $aiGradingService;

    public function __construct(AiGradingService $aiGradingService)
    {
        $this->aiGradingService = $aiGradingService;
    }

    /**
     * Show the student results page.
     */
    public function getResults(): Response
    {
        $user = auth()->user()->load('student');
        $student = $user->student;

        // Fetch submissions with their related data
        $submissions = Submission::where('student_id', $student->id)
            ->with([
                'test',
                'aiGradingResults' => function($query) {
                    $query->latest();
                }
            ])
            ->orderBy('created_at', 'desc')
            ->get();

        // Format the results for the frontend
        $formattedResults = $submissions->map(function($submission) {
            $latestAiResult = $submission->aiGradingResults->first();
            
            return [
                'id' => $submission->id,
                'test' => [
                    'id' => $submission->test->id,
                    'title' => $submission->test->title,
                ],
                'score' => $submission->status === 'published' ? $submission->final_grade : null,
                'comment' => $submission->status === 'published' ? $submission->teacher_feedback : null,
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
    public function getTests(): Response // Specify return type
    {
        $user = auth()->user()->load('student'); // Load the student relationship

        // Get the authenticated student model
        $student = $user->student;

        // --- Fetch tests assigned to this student via the many-to-many relationship ---
        // Use the 'tests' relationship defined on the Student model
        // Eager load the class and its department for potential future use on the frontend
        $tests = $student->tests()->with(['class.department'])->get();
        // --- End Fetch ---

        // Return the Inertia page with the student's tests
        return Inertia::render('dashboard/studentDashboard/Tests/Index', [
            'tests' => $tests->toArray(), // Pass the tests as an array
        ]);
    }

    /**
     * Show a specific test page for a student.
     */
    public function showTest($id): Response
    {
        $test = Test::findOrFail($id);
        $student = auth()->user()->student;
        
        // Verify student has access to this test
        if ($test->department_id !== $student->department_id) {
            abort(403, 'Unauthorized');
        }

        // Load necessary relationships
        $test->load(['class.department', 'teacher.user']);

        // Get student's submission if exists
        $submission = $test->submissions()
            ->where('student_id', $student->id)
            ->first();

        return Inertia::render('dashboard/studentDashboard/Tests/TestDetail', [
            'test' => [
                'id' => $test->id,
                'title' => $test->title,
                'problemStatement' => $test->problem_statement,
                'dueDate' => $test->due_date ? $test->due_date->format('Y-m-d H:i:s') : null,
                'status' => $test->status,
                'metrics' => $test->metrics,
                'gradingCriteria' => $test->grading_criteria,
                'class_id' => $test->class_id,
                'department_id' => $test->department_id,
                'class' => $test->class ? [
                    'id' => $test->class->id,
                    'name' => $test->class->name,
                    'department' => $test->class->department->name ?? 'N/A'
                ] : null,
                'department' => $test->department ? [
                    'id' => $test->department->id,
                    'name' => $test->department->name
                ] : null,
                'teacher' => $test->teacher ? [
                    'id' => $test->teacher->id,
                    'name' => $test->teacher->user->first_name . ' ' . $test->teacher->user->last_name
                ] : null,
            ],
            'submission' => $submission ? [
                'id' => $submission->id,
                'submitted_code' => $submission->submitted_code,
                'submitted_file_path' => $submission->submitted_file_path,
                'status' => $submission->status,
                'created_at' => $submission->created_at ? $submission->created_at->format('Y-m-d H:i:s') : null,
                'grade' => $submission->grade ? [
                    'graded_value' => $submission->grade->graded_value,
                    'adjusted_grade' => $submission->grade->adjusted_grade,
                    'comments' => $submission->grade->comments
                ] : null,
                'feedback' => $submission->feedback ? [
                    'feedback_text' => $submission->feedback->feedback_text
                ] : null,
            ] : null,
            'submissionWarning' => !$submission ? 'Note: You can only submit once. Please make sure your solution is correct before submitting.' : null
        ]);
    }

    /**
     * Handle student code file submission.
     */
    public function submitFile(Request $request, $id): RedirectResponse // Specify return type
    {
        // Validation and file handling logic here
        // ...

        // Redirect after successful submission
        return redirect()->back()->with('success', 'File submitted successfully!');
    }

    /**
     * Handle student code text submission.
     */
    public function submitCode(Request $request, $id): RedirectResponse // Specify return type
    {
        // Validation and code handling logic here
        // ...

        // Redirect after successful submission
        return redirect()->back()->with('success', 'Code submitted successfully!');
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
        // First, find the test and ensure it exists
        $test = Test::findOrFail($id);
        
        // Load the test's relationships
        $test->load(['class', 'department']);

        $validator = Validator::make($request->all(), [
            "submission_type" => "required|in:file,editor",
            "code_file" => "required_if:submission_type,file|nullable|file|mimetypes:text/plain,text/x-python,application/octet-stream|mimes:txt,py,java,cpp,js,cs,php",
            "code_editor_text" => "required_if:submission_type,editor|string",
            "language" => "required|string|in:cpp,python"
        ]);

        if ($validator->fails()) {
            return Inertia::render('dashboard/studentDashboard/Tests/TestDetail', [
                'test' => $test,
                'error' => $validator->errors()->first()
            ]);
        }

        // Load the student with their classes relationship
        $student = $request->user()->load('student.classes')->student;

        // Add logging to debug the values
        \Log::info('Student and Test Details', [
            'student_classes' => $student->classes->pluck('id'),
            'test_class_id' => $test->class_id,
            'student_department_id' => $student->department_id,
            'test_department_id' => $test->department_id,
            'student_id' => $student->id,
            'test_id' => $test->id
        ]);

        // Check if student's department matches and if they are enrolled in the test's class
        if ($student->department_id != $test->department_id || !$student->classes->contains('id', $test->class_id)) {
            \Log::warning('Class/Department mismatch', [
                'student_classes' => $student->classes->pluck('id'),
                'test_class_id' => $test->class_id,
                'student_department_id' => $student->department_id,
                'test_department_id' => $test->department_id
            ]);
            
            return Inertia::render('dashboard/studentDashboard/Tests/TestDetail', [
                'test' => $test,
                'error' => 'You are not enrolled in the class or department for this test'
            ]);
        }

        try {
            $filePath = null;
            if ($request->submission_type === "file" && $request->hasFile("code_file")) {
                $originalName = $request->file("code_file")->getClientOriginalName();
                $timestamp = now()->format('Ymd_His');
                $newFileName = $timestamp . '_' . $originalName;
                $filePath = $request->file("code_file")->storeAs("submissions", $newFileName);
            }

            $submission = Submission::create([
                "test_id" => $test->id,
                "student_id" => $student->id,
                "submission_type" => $request->submission_type,
                "code_file_path" => $filePath,
                "language" => $request->language,
                "code_editor_text" => $request->code_editor_text,
                "submission_date" => now(),
                "status" => "pending" // Initial status, AI grading will update it
            ]);

            // --- ASYNCHRONOUS AI GRADING INTEGRATION START ---
            // Dispatch the job to grade the submission in the background
            \App\Jobs\GradeSubmission::dispatch($submission);
            Log::info('AI grading job dispatched for submission', [
                'submission_id' => $submission->id,
                'queue' => 'grading',
                'status' => 'pending'
            ]);
            // --- ASYNCHRONOUS AI GRADING INTEGRATION END ---

            return Inertia::render('dashboard/studentDashboard/Tests/TestDetail', [
                'test' => $test,
                'submission' => [
                    'id' => $submission->id,
                    'status' => 'pending',
                    'created_at' => $submission->created_at->format('Y-m-d H:i:s')
                ],
                'success' => 'Test submitted successfully. AI grading is being processed in the background. You can check the status on your submissions page.'
            ]);
        } catch (\Exception $e) {
            return Inertia::render('dashboard/studentDashboard/Tests/TestDetail', [
                'test' => $test,
                'error' => 'Failed to submit test: ' . $e->getMessage()
            ]);
        }
    }

    public function checkStatus()
    {
        $student = auth()->user()->student;
        
        if ($student->status === 'assigned') {
            return Inertia::render('WaitingScreen', [
                'status' => 'success',
                'message' => 'You have been assigned to a class! Redirecting to dashboard...'
            ]);
        }
        
        return Inertia::render('WaitingScreen', [
            'status' => 'info',
            'message' => 'Your account is still pending assignment. Please wait while an administrator assigns you to a class.'
        ]);
    }

    public function dashboard(): Response
    {
        $student = auth()->user()->student;
        
        \Log::info('Student data', [
            'student_id' => $student->id,
            'class_id' => $student->class_id,
            'department_id' => $student->department_id
        ]);

        // Get tests for student's class that are not past due date
        $tests = Test::where('class_id', $student->class_id)
            ->where('published', true)
            ->where('due_date', '>', now())
            ->with([
                'class.department',
                'teacher.user',
                'submissions' => function($query) use ($student) {
                    $query->where('student_id', $student->id);
                }
            ])
            ->get();

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
                    'class' => $student->class ? [
                        'name' => $student->class->name,
                        'department' => $student->class->department->name,
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
        
        if ($student->status === 'assigned') {
            return redirect()->route('student.dashboard');
        }

        return Inertia::render('WaitingScreen', [
            'status' => 'info',
            'message' => 'Your account is still pending assignment. Please wait while an administrator assigns you to a class.'
        ]);
    }
}