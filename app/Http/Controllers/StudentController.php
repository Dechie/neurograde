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

class StudentController extends Controller
{
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
        
        // Get tests for student's department and section
        $tests = Test::where('department_id', $student->department_id)
            ->where('due_date', '>', now())
            ->where('published', false)
            ->with(['teacher', 'submissions' => function($query) use ($student) {
                $query->where('student_id', $student->id);
            }])
            ->get();

        return Inertia::render('dashboard/studentDashboard/Tests/Index', [
            'tests' => $tests
        ]);
    }

    public function submitTest(Request $request, $id)
    {
        $test = Test::findOrFail($id);
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
            return Inertia::render('dashboard/studentDashboard/Tests/TestDetail', [
                'test' => $test,
                'errors' => $validator->errors()
            ]);
        }

        $student = $request->user()->student;

        if (!$student->tests()->where("test_id", $test->id)->exists()) {
            return Inertia::render('dashboard/studentDashboard/Tests/TestDetail', [
                'test' => $test,
                'error' => 'You are not assigned to this test'
            ]);
        }

        try {
            // Check if submission already exists
            $existingSubmission = Submission::where('student_id', $student->id)
                ->where('test_id', $test->id)
                ->first();

            if ($existingSubmission) {
                return Inertia::render('dashboard/studentDashboard/Tests/TestDetail', [
                    'test' => $test,
                    'error' => 'You have already submitted this test. Please contact your teacher if you need to resubmit.'
                ]);
            }

            $filePath = null;
            if ($request->submission_type === "file" && $request->hasFile("code_file")) {
                $filePath = $request->file("code_file")->store("submissions");
            }

            $submission = Submission::create([
                "test_id" => $test->id,
                "student_id" => $student->id,
                "submission_type" => $request->submission_type,
                "code_file_path" => $filePath,
                "code_editor_text" => $request->code_editor_text,
                "submission_date" => now(),
                "status" => "pending"
            ]);

            return Inertia::render('dashboard/studentDashboard/Tests/TestDetail', [
                'test' => $test,
                'success' => 'Test submitted successfully'
            ]);
        } catch (\Exception $e) {
            // Handle other types of errors
            return Inertia::render('dashboard/studentDashboard/Tests/TestDetail', [
                'test' => $test,
                'error' => 'An error occurred while submitting your test. Please try again.'
            ]);
        }
    }
   
}