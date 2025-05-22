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
    public function getResults(): Response // Specify return type
    {
        $user = auth()->user()->load('student'); // Load the student relationship

        // Fetch AI grading results for submissions made by this student
        $recentResults = AiGradingResult::whereHas('submission', function($query) use ($user) {
            $query->where('student_id', $user->student->id); // Filter submissions by the authenticated student's ID
        })
        ->with(['submission.test']) // Eager load submission and its test
        ->orderBy('created_at', 'desc')
        ->take(5) // Limit to recent results
        ->get();

        // Format the results for the frontend
        $formattedResults = $recentResults->map(function($result) {
             // Ensure relationships are loaded if needed here (e.g., $result->submission->load('test'))
             // if not already loaded by default or in the initial query
            return [
                'id' => $result->id,
                'test' => [
                    'id' => $result->submission->test->id ?? null, // Use null coalescing for safety
                    'title' => (string)($result->submission->test->title ?? 'N/A'),
                ],
                'score' => (float)($result->graded_value ?? 0),
                'comment' => (string)($result->comment ?? ''),
                // Convert metrics to a simple array if it's not already
                'metrics' => is_string($result->metrics) ? json_decode($result->metrics, true) : (array)($result->metrics ?? []),
                // Assuming submission_date is a Carbon instance or similar
                'submission_date' => $result->submission->created_at ? $result->submission->created_at->format('Y-m-d H:i:s') : 'N/A', // Use created_at or a dedicated submission_date field
                'status' => (string)($result->submission->status ?? 'Unknown'),
            ];
        })->toArray(); // Convert to array

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
                'class' => $test->class ? [
                    'id' => $test->class->id,
                    'name' => $test->class->name,
                    'department' => $test->class->department->name ?? 'N/A'
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
        try {
            $test = Test::findOrFail($id);
            \Log::info('Test submission attempt', [
                'test_id' => $id,
                'submission_type' => $request->submission_type,
                'has_file' => $request->hasFile('code_file'),
                'code_length' => strlen($request->code_editor_text ?? '')
            ]);

            $validator = Validator::make($request->all(), [
                "submission_type" => "required|in:file,editor",
                "code_file" => [
                    "required_if:submission_type,file",
                    "nullable",
                    "file",
                    function ($attribute, $value, $fail) {
                        if ($value) {
                            $extension = strtolower($value->getClientOriginalExtension());
                            $allowedExtensions = ['cpp', 'hpp', 'h', 'c', 'py'];
                            if (!in_array($extension, $allowedExtensions)) {
                                $fail('The file must be a C++ or Python file.');
                            }
                        }
                    }
                ],
                "code_editor_text" => "required_if:submission_type,editor|string"
            ]);

            if ($validator->fails()) {
                \Log::warning('Validation failed for test submission', [
                    'test_id' => $id,
                    'errors' => $validator->errors()->toArray()
                ]);
                
                return Inertia::render('dashboard/studentDashboard/Tests/TestDetail', [
                    'test' => $test,
                    'errors' => $validator->errors()
                ]);
            }

            $student = $request->user()->student;

            // Check if student is in the same class as the test
            if (!$student->classes()->where('class_id', $test->class_id)->exists()) {
                \Log::warning('Student not enrolled in test class', [
                    'student_id' => $student->id,
                    'test_id' => $test->id,
                    'class_id' => $test->class_id
                ]);
                
                return Inertia::render('dashboard/studentDashboard/Tests/TestDetail', [
                    'test' => $test,
                    'error' => 'You are not enrolled in the class for this test'
                ]);
            }

            // Check if submission already exists
            $existingSubmission = Submission::where('student_id', $student->id)
                ->where('test_id', $test->id)
                ->first();

            if ($existingSubmission) {
                \Log::warning('Duplicate submission attempt', [
                    'student_id' => $student->id,
                    'test_id' => $test->id,
                    'existing_submission_id' => $existingSubmission->id
                ]);
                
                return Inertia::render('dashboard/studentDashboard/Tests/TestDetail', [
                    'test' => $test,
                    'error' => 'You have already submitted this test. Please contact your teacher if you need to resubmit.'
                ]);
            }

            $filePath = null;
            if ($request->submission_type === "file" && $request->hasFile("code_file")) {
                try {
                    $filePath = $request->file("code_file")->store("submissions");
                    \Log::info('File stored successfully', [
                        'file_path' => $filePath,
                        'original_name' => $request->file("code_file")->getClientOriginalName()
                    ]);
                } catch (\Exception $e) {
                    \Log::error('File storage failed', [
                        'error' => $e->getMessage(),
                        'file_name' => $request->file("code_file")->getClientOriginalName()
                    ]);
                    throw new \Exception('Failed to store the submitted file: ' . $e->getMessage());
                }
            }

            $submission = Submission::create([
                "test_id" => $test->id,
                "student_id" => $student->id,
                "submission_type" => $request->submission_type,
                "code_file_path" => $filePath,
                "code_editor_text" => $request->code_editor_text,
                "submission_date" => $request->submission_date ? date('Y-m-d H:i:s', strtotime($request->submission_date)) : now(),
                "status" => Submission::STATUS_PENDING
            ]);

            // Trigger AI grading
            try {
                $this->aiGradingService->gradeSubmission($submission);
            } catch (\Exception $e) {
                \Log::error('AI grading failed', [
                    'submission_id' => $submission->id,
                    'error' => $e->getMessage()
                ]);
                // Continue with the submission even if AI grading fails
            }

            \Log::info('Test submission successful', [
                'submission_id' => $submission->id,
                'test_id' => $test->id,
                'student_id' => $student->id
            ]);

            return Inertia::render('dashboard/studentDashboard/Tests/TestDetail', [
                'test' => $test,
                'success' => 'Test submitted successfully'
            ]);
        } catch (\Exception $e) {
            \Log::error('Test submission failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'test_id' => $id,
                'student_id' => $request->user()->student->id ?? null
            ]);

            return Inertia::render('dashboard/studentDashboard/Tests/TestDetail', [
                'test' => $test ?? null,
                'error' => 'An error occurred while submitting your test: ' . $e->getMessage()
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
        
        // Get tests for the student's class
        $tests = Test::where('class_id', $student->class_id)
            ->where('published', true)
            ->with(['class.department', 'teacher.user'])
            ->get()
            ->map(function ($test) use ($student) {
                $submission = $test->submissions()
                    ->where('student_id', $student->id)
                    ->first();

                return [
                    'id' => $test->id,
                    'title' => $test->title,
                    'dueDate' => $test->due_date ? $test->due_date->format('Y-m-d H:i:s') : null,
                    'status' => $test->status,
                    'class' => $test->class ? [
                        'id' => $test->class->id,
                        'name' => $test->class->name,
                        'department' => $test->class->department->name ?? 'N/A'
                    ] : null,
                    'teacher' => $test->teacher ? [
                        'id' => $test->teacher->id,
                        'name' => $test->teacher->user->first_name . ' ' . $test->teacher->user->last_name
                    ] : null,
                    'submission' => $submission ? [
                        'id' => $submission->id,
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
                ];
            });

        return Inertia::render('dashboard/studentDashboard/StudentDashboard', [
            'tests' => $tests,
            'student' => [
                'id' => $student->id,
                'name' => $student->user->first_name . ' ' . $student->user->last_name,
                'class' => $student->class ? [
                    'id' => $student->class->id,
                    'name' => $student->class->name,
                    'department' => $student->class->department->name ?? 'N/A'
                ] : null,
            ]
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