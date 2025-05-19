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

        return Inertia::render('dashboard/studentDashbord/Results', [
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
        return Inertia::render('dashboard/studentDashbord/Tests/Index', [
            'tests' => $tests->toArray(), // Pass the tests as an array
        ]);
    }

    /**
     * Show a specific test page for a student.
     */
    public function showTest(Test $test): Response
    {
        $student = auth()->user()->student;
        
        // Verify student has access to this test
        if ($test->department_id !== $student->department_id || 
            $test->section !== $student->section) {
            abort(403, 'Unauthorized');
        }

        // Load necessary relationships
        $test->load(['class.department', 'teacher.user']);

        // Get student's submission if exists
        $submission = $test->submissions()
            ->where('student_id', $student->id)
            ->first();

        return Inertia::render('dashboard/studentDashboard/TestDetail', [
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
            ->where('section', $student->section)
            ->where('due_date', '>', now())
            ->where('published', false)
            ->with(['teacher', 'submissions' => function($query) use ($student) {
                $query->where('student_id', $student->id);
            }])
            ->get();

        return Inertia::render('dashboard/studentDashbord/Tests/Index', [
            'tests' => $tests
        ]);
    }

    public function submitTest(Request $request, Test $test)
    {
        $student = auth()->user()->student;
        
        // Verify student has access to this test
        if ($test->department_id !== $student->department_id || 
            $test->section !== $student->section) {
            abort(403, 'Unauthorized');
        }

        // Verify test is still open
        if ($test->due_date < now()) {
            return response()->json(['error' => 'Test deadline has passed'], 400);
        }

        $validator = Validator::make($request->all(), [
            'code_file' => 'nullable|file|max:10240', // 10MB max
            'code_editor_text' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $submission = new Submission();
            $submission->test_id = $test->id;
            $submission->student_id = $student->id;
            $submission->submission_date = now();

            if ($request->hasFile('code_file')) {
                $path = $request->file('code_file')->store('submissions');
                $submission->code_file_path = $path;
                $submission->submission_type = 'file';
            } elseif ($request->has('code_editor_text')) {
                $submission->code_editor_text = $request->code_editor_text;
                $submission->submission_type = 'text';
            } else {
                return response()->json(['error' => 'Either code file or text must be provided'], 422);
            }

            $submission->save();

            return response()->json(['message' => 'Submission successful']);
        } catch (\Exception $e) {
            \Log::error('Failed to submit test', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to submit test'], 500);
        }
    }
}
