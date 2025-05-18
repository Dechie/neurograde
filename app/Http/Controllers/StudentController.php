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
    public function showTest($id): Response // Specify return type
    {
        $user = auth()->user()->load('student'); // Load the student relationship
        $student = $user->student;

        // Find the test and ensure it is assigned to the authenticated student
        $test = Test::whereHas('students', function($query) use ($student) {
            $query->where('students.id', $student->id);
        })
        ->findOrFail($id); // Find the test by ID, or throw 404 if not found or not assigned

        // You might want to eager load the class, teacher, etc. here if needed for the Show page
        $test->load(['class.department', 'teacher.user']);

        // You might also want to fetch the student's submission for this test if one exists
        $submission = $test->submissions()->where('student_id', $student->id)->first();

        return Inertia::render('dashboard/studentDashbord/Tests/Show', [
            'test' => [
                'id' => $test->id,
                'title' => $test->title,
                'problemStatement' => $test->problem_statement,
                'dueDate' => $test->due_date ? $test->due_date->format('Y-m-d H:i:s') : null, // Format date
                'status' => $test->status,
                'metrics' => $test->metrics, // Pass metrics if needed on the show page
                'class' => $test->class ? ['id' => $test->class->id, 'name' => $test->class->name, 'department' => $test->class->department->name ?? 'N/A'] : null,
                'teacher' => $test->teacher ? ['id' => $test->teacher->id, 'name' => $test->teacher->user->first_name . ' ' . $test->teacher->user->last_name] : null,
            ],
            'submission' => $submission ? [ // Pass submission data if it exists
                'id' => $submission->id,
                'submitted_code' => $submission->submitted_code, // Assuming this column exists
                'submitted_file_path' => $submission->submitted_file_path, // Assuming this column exists
                'status' => $submission->status,
                'created_at' => $submission->created_at ? $submission->created_at->format('Y-m-d H:i:s') : null,
                // You might eager load and pass grades/feedback here too
                'grade' => $submission->grade ? ['graded_value' => $submission->grade->graded_value, 'adjusted_grade' => $submission->grade->adjusted_grade, 'comments' => $submission->grade->comments] : null,
                'feedback' => $submission->feedback ? ['feedback_text' => $submission->feedback->feedback_text] : null,
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
}
