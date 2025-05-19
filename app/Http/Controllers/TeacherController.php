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
        // Get the authenticated teacher model
        $teacher = Auth::user()->teacher;

        // Use a Form Request for cleaner validation if this gets complex
        $validator = Validator::make($request->all(), [
            "title" => "required|string|max:255",
            "problem_statement" => "required|string",
            "due_date" => "required|date|after:now",
            "class_id" => "required|exists:classes,id",
            "section" => "required|string|max:10",
            "metrics" => "required|json"
        ]);

        if ($validator->fails()) {
            throw ValidationException::withMessages($validator->errors()->toArray());
        }

        // Find the class
        $class = ClassRoom::findOrFail($request->class_id);

        // Verify the teacher is assigned to this class
        if (!$teacher->classes->contains($class->id)) {
            throw ValidationException::withMessages([
                'class_id' => 'You are not assigned to this class.',
            ]);
        }

        try {
            // Create the Test record
            $test = Test::create([
                "teacher_id" => $teacher->id,
                "department_id" => $teacher->department_id, // Use teacher's department
                "section" => $request->section,
                "class_id" => $request->class_id,
                "title" => $request->title,
                "problem_statement" => $request->problem_statement,
                "due_date" => $request->due_date,
                "metrics" => json_decode($request->metrics, true),
                "status" => "Upcoming"
            ]);

            // Assign the test to all students in the class via the test_student pivot table
            $studentIds = $class->students()->pluck("students.id");
            $test->students()->sync($studentIds);

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

        return Inertia::render("dashboard/teacherDashboard/SubmittedExam");
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
}
