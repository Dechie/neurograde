<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use App\Models\Test;
use App\Models\ClassRoom;
use App\Models\Submission;
use App\Models\Grade;
use App\Models\Feedback;
use App\Models\Student;
use App\Models\Teacher; // Import Teacher model


class TeacherController extends Controller
{
    /**
     * Show the create exam page for a teacher.
     */
    public function showCreateExam(): Response
    {
        // Get the authenticated teacher model, eager load their classes and department
        $teacher = Auth::user()->teacher()->with('classes.department')->first();

          // Add logging here
    \Log::info('Authenticated Teacher ID: ' . $teacher->id);
    \Log::info('Classes loaded for teacher: ' . $teacher->classes->toJson()); // Log the collection as JSON
        // Fetch the classes taught by this teacher
        $classes = $teacher->classes; // Access the eager loaded classes

        // Render the Inertia page and pass the classes as props
        return Inertia::render('dashboard/teacherDashboard/CreateExam', [
            'classes' => $classes->toArray(), // Pass classes data to the frontend
            // You might pass other data here if needed for the form, e.g., default metrics structure
        ]);
    }

    /**
     * Handle storing a newly created test.
     */
    public function createTest(Request $request): RedirectResponse
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'problem_statement' => 'required|string',
            'due_date' => 'required|date|after:now',
            'class_id' => 'required|exists:classes,id',
            'metrics' => 'required|json'
        ]);

        $teacher = auth()->user()->teacher;
        $class = ClassRoom::findOrFail($request->class_id);

        if ($class->teacher_id != $teacher->id) {
            return redirect()->back()
                ->withInput()
                ->with('error', 'You are not assigned to this class');
        }

        try {
            // Create the Test record
            $test = Test::create([
                "teacher_id" => $teacher->id,
                "department_id" => $teacher->department_id,
                "class_id" => $request->class_id,
                "title" => $request->title,
                "problem_statement" => $request->problem_statement,
                "due_date" => $request->due_date,
                "metrics" => json_decode($request->metrics, true),
                "status" => "Upcoming"
            ]);

            return redirect()->route('teacher.tests.index')
                ->with('success', 'Test created successfully!');

        } catch (\Exception $e) {
            \Log::error('Failed to create test', ['error' => $e->getMessage(), 'request' => $request->all()]);

            return redirect()->back()
                ->withInput()
                ->with('error', 'Failed to create test. Please try again.');
        }
    }

    // ... other teacher controller methods ...
    public function showGradingPage() { 
        return Inertia::render("dashboard/teacherDashboard/GradingPage");
    }
    public function showSubmissionsPage() { 
        $teacher = auth()->user()->teacher;
        $tests = $teacher->tests()
            ->with(['submissions.student.user'])
            ->get();

        return Inertia::render("dashboard/teacherDashboard/SubmittedExam", [
            'tests' => $tests
        ]);
    }
    // public function getTests(Request $request) { ... } // Needs conversion if used for a page
    // public function getTestSubmissions(Request $request, Test $test) { ... } // Needs conversion if used for a page
    // public function gradeSubmission(Request $request, Submission $submission) { ... } // Needs conversion if used for a web action
    // public function addFeedback(Request $request, Submission $submission) { ... } // Needs conversion if used for a web action
    // public function getClasses(Request $request) { ... } // This data is now fetched and passed by showCreateExam

    public function publishGrades(Test $test)
    {
        // Ensure the teacher owns this test
        if ($test->teacher_id !== auth()->user()->teacher->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Update all grades for this test's submissions
        foreach ($test->submissions as $submission) {
            foreach ($submission->grades as $grade) {
                $grade->update(['status' => 'published']);
            }
        }

        // Mark the test as published
        $test->update([
            'published' => true,
            'published_at' => now()
        ]);

        return response()->json(['message' => 'Grades published successfully']);
    }

    public function overrideGrade(Request $request, Grade $grade)
    {
        // Ensure the teacher owns this grade's test
        if ($grade->submission->test->teacher_id !== auth()->user()->teacher->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'adjusted_grade' => 'required|numeric|min:0|max:100',
            'override_reason' => 'required|string|max:500',
            'comments' => 'nullable|string|max:1000'
        ]);

        $grade->update([
            'adjusted_grade' => $validated['adjusted_grade'],
            'override_reason' => $validated['override_reason'],
            'comments' => $validated['comments'] ?? null
        ]);

        return response()->json(['message' => 'Grade overridden successfully']);
    }

    public function showTestSubmissions($testId)
    {
        $teacher = auth()->user()->teacher;
        $test = $teacher->tests()
            ->with(['submissions.student.user'])
            ->findOrFail($testId);

        return Inertia::render('dashboard/teacherDashboard/SubmittedExam', [
            'test' => $test
        ]);
    }

    public function showSubmission($submissionId)
    {
        $teacher = auth()->user()->teacher;
        
        // Get the submission with its relationships
        $submission = Submission::with(['student.user', 'test', 'grades'])
            ->whereHas('test', function ($query) use ($teacher) {
                $query->where('teacher_id', $teacher->id);
            })
            ->findOrFail($submissionId);

        return Inertia::render('dashboard/teacherDashboard/SubmissionDetail', [
            'submission' => $submission
        ]);
    }

    public function gradeSubmission(Request $request, $submissionId)
    {
        $teacher = auth()->user()->teacher;
        
        // Verify the submission belongs to a test created by this teacher
        $submission = Submission::whereHas('test', function ($query) use ($teacher) {
            $query->where('teacher_id', $teacher->id);
        })->findOrFail($submissionId);

        $validated = $request->validate([
            'grade' => 'required|numeric|min:0|max:100',
            'feedback' => 'nullable|string|max:1000'
        ]);

        // Create or update the grade
        $grade = $submission->grades()->updateOrCreate(
            ['teacher_id' => $teacher->id],
            [
                'grade' => $validated['grade'],
                'feedback' => $validated['feedback'],
                'status' => 'graded'
            ]
        );

        // Update submission status
        $submission->update(['status' => 'graded']);

        return response()->json([
            'message' => 'Submission graded successfully',
            'grade' => $grade
        ]);
    }
}
