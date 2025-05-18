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
            "class_id" => "required|exists:classes,id", // Validate class_id exists
            "metrics" => "required|json" // Validate as JSON string initially
        ]);

        // If validation fails, throw a ValidationException
        if ($validator->fails()) {
            throw ValidationException::withMessages($validator->errors()->toArray());
        }

        // Find the class
        $class = ClassRoom::findOrFail($request->class_id);

        // --- Updated Check: Verify the teacher is assigned to this class via the many-to-many relationship ---
        // Check if the authenticated teacher's collection of classes contains the selected class ID
        if (!$teacher->classes->contains($class->id)) {
             // Throw a validation exception if the teacher is NOT assigned to the class
             throw ValidationException::withMessages([
                'class_id' => 'You are not assigned to this class.',
            ]);
        }
        // --- End Updated Check ---

        // Note: A department match check between teacher and class is implicitly handled
        // if the admin assignment process (using assignClassToTeacher) already enforces it.
        // If you need an explicit check here as well:
        // if ($teacher->department_id !== $class->department_id) {
        //      throw ValidationException::withMessages([
        //         'class_id' => 'This class does not belong to your department.',
        //     ]);
        // }


        try {
            // Create the Test record
            // We still store teacher_id on the test to indicate who created it.
            // We still store class_id on the test as per your schema, assuming a test belongs to a single class.
            $test = Test::create([
                "teacher_id" => $teacher->id, // The teacher who created the test
                "class_id" => $request->class_id, // The class the test is for
                "title" => $request->title,
                "problem_statement" => $request->problem_statement,
                "due_date" => $request->due_date,
                "metrics" => json_decode($request->metrics, true), // Decode JSON string to array
                "status" => "Upcoming" // Set initial status
            ]);

            // Assign the test to all students in the class via the test_student pivot table
            // This assumes a test is assigned to ALL students in the selected class.
            $studentIds = $class->students()->pluck("students.id");
            $test->students()->sync($studentIds); // Sync the test with student IDs

            // Redirect to the teacher's test list page on success
            // Assuming you have a route named 'teacher.tests.index' for the test list
            return redirect()->route('teacher.tests.index')
                             ->with('success', 'Test created successfully!'); // Add a success flash message

        } catch (\Exception $e) {
            // Log the error for debugging
            \Log::error('Failed to create test', ['error' => $e->getMessage(), 'request' => $request->all()]);

            // Redirect back with an error flash message
            return redirect()->back()
                             ->withInput() // Keep old input in the form
                             ->with('error', 'Failed to create test. Please try again.'); // Add an error flash message
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

}
