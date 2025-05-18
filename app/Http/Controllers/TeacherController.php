<?php

// namespace App\Http\Controllers;

// use Illuminate\Http\Request;
// use Inertia\Inertia;

// class TeacherController extends Controller
// {
//     public function showCreateExam() 
//     {
//         return Inertia::render('dashboard/teacherDashboard/CreateExam');
//     }

//     public function showGradingPage() 
//     {
//         return Inertia::render('dashboard/teacherDashboard/GradingPage');
//     }

//     public function showSubmissionsPage()
//     {
//         return Inertia::render('dashboard/teacherDashboard/GradingPage');
//     }
//     public function createTest(Request $request)
//     {
//         $validator = Validator::make($request->all(), [
//             "title" => "required|string|max:255",
//             "problem_statement" => "required|string",
//             "due_date" => "required|date|after:now",
//             "class_id" => "required|exists:classes,id",
//             "metrics" => "required|json"
//         ]);

//         if ($validator->fails()) {
//             return response()->json(['errors' => $validator->errors()], 422);
//         }

//         $teacher = Auth::user()->teacher;
//         $class = ClassRoom::findOrFail($request->class_id);

//         if ($class->teacher_id != $teacher->id) {
//             return response()->json(["message" => "You are not assigned to this class"], 403);
//         }

//         try {
//             $test = Test::create([
//                 "teacher_id" => $teacher->id,
//                 "class_id" => $request->class_id,
//                 "title" => $request->title,
//                 "problem_statement" => $request->problem_statement,
//                 "due_date" => $request->due_date,
//                 "metrics" => json_decode($request->metrics, true),
//                 "status" => "Upcoming"
//             ]);

//             $studentIds = $class->students()->pluck("students.id");
//             $test->students()->sync($studentIds);

//             return response()->json([
//                 "message" => "Test created successfully",
//                 "test" => $test->load(["class", "students.user"])
//             ], 201);

//         } catch (\Exception $e) {
//             return response()->json([
//                 "message" => "Failed to create test",
//                 "error" => $e->getMessage()
//             ], 500);
//         }
//     }

//     public function getTests(Request $request)
//     {
//         $teacher = Auth::user()->teacher;
        
//         $tests = Test::with(["class", "students.user", "submissions"])
//             ->where("teacher_id", $teacher->id)
//             ->orderBy('due_date', 'asc')
//             ->get();

//         return response()->json($tests);
//     }

//     public function getTestSubmissions(Request $request, Test $test)
//     {
//         $teacher = Auth::user()->teacher;

//         if ($test->teacher_id != $teacher->id) {
//             return response()->json(["message" => "Unauthorized access to this test"], 403);
//         }

//         $submissions = $test->submissions()
//             ->with(["student.user", "grades"])
//             ->get();

//         return response()->json($submissions);
//     }

//     public function gradeSubmission(Request $request, Submission $submission)
//     {
//         $validator = Validator::make($request->all(), [
//             "graded_value" => "required|numeric|min:0|max:100",
//             "comments" => "nullable|string",
//             "adjusted_grade" => "nullable|numeric|min:0|max:100",
//             "override_reason" => "nullable|string|required_if:adjusted_grade,!=,null"
//         ]);

//         if ($validator->fails()) {
//             return response()->json(['errors' => $validator->errors()], 422);
//         }

//         $teacher = Auth::user()->teacher;

//         if ($submission->test->teacher_id != $teacher->id) {
//             return response()->json(["message" => "Unauthorized access to this submission"], 403);
//         }

//         try {
//             $grade = Grade::updateOrCreate(
//                 ['submission_id' => $submission->id],
//                 [
//                     'teacher_id' => $teacher->id,
//                     'graded_value' => $request->graded_value,
//                     'adjusted_grade' => $request->adjusted_grade ?? $request->graded_value,
//                     'override_reason' => $request->override_reason,
//                     'comments' => $request->comments,
//                 ]
//             );

//             $submission->update(['status' => 'graded']);

//             return response()->json([
//                 'message' => 'Submission graded successfully',
//                 'grade' => $grade,
//             ]);

//         } catch (\Exception $e) {
//             return response()->json([
//                 "message" => "Failed to grade submission",
//                 "error" => $e->getMessage()
//             ], 500);
//         }
//     }

//     public function addFeedback(Request $request, Submission $submission)
//     {
//         $validator = Validator::make($request->all(), [
//             "feedback_text" => "required|string",
//             "annotations" => "nullable|string"
//         ]);

//         if ($validator->fails()) {
//             return response()->json(['errors' => $validator->errors()], 422);
//         }

//         $teacher = Auth::user()->teacher;

//         if ($submission->test->teacher_id != $teacher->id) {
//             return response()->json([
//                 "message" => "Unauthorized access to this submission"
//             ], 403);
//         }

//         try {
//             $feedback = Feedback::create([
//                 "submission_id" => $submission->id,
//                 "teacher_id" => $teacher->id,
//                 "feedback_text" => $request->feedback_text,
//                 "annotations" => $request->annotations
//             ]);

//             if ($submission->status != "graded") {
//                 $submission->update(["status" => "reviewed"]);
//             }

//             return response()->json([
//                 "message" => "Feedback added successfully",
//                 "feedback" => $feedback
//             ], 201);

//         } catch (\Exception $e) {
//             return response()->json([
//                 "message" => "Failed to add feedback",
//                 "error" => $e->getMessage()
//             ], 500);
//         }
//     }

//     public function getClasses(Request $request)
//     {
//         $teacher = Auth::user()->teacher;
        
//         $classes = $teacher->classes()
//             ->with(["department", "students.user"])
//             ->orderBy('name', 'asc')
//             ->get();

//         return response()->json($classes);
//     }
// }

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response; // Import Inertia Response
use Illuminate\Http\RedirectResponse; // Import RedirectResponse
use Illuminate\Support\Facades\Auth; // Import Auth facade
use Illuminate\Support\Facades\Validator; // Import Validator facade
use Illuminate\Validation\ValidationException; // Import ValidationException
use App\Models\Test; // Import Test model
use App\Models\ClassRoom; // Import ClassRoom model
use App\Models\Submission; // Import Submission model (for grading/feedback methods)
use App\Models\Grade; // Import Grade model (for grading method)
use App\Models\Feedback; // Import Feedback model (for feedback method)
use App\Models\Student; // Import Student model (for test creation logic)


class TeacherController extends Controller
{
    /**
     * Show the create exam page for a teacher.
     */
    public function showCreateExam(): Response // Return Inertia Response
    {
        // Get the authenticated teacher
        $teacher = Auth::user()->teacher;

        // Fetch the classes taught by this teacher, eager loading department and students
        $classes = $teacher->classes()
            ->with(['department', 'students.user']) // Eager load relationships needed for context
            ->orderBy('name', 'asc')
            ->get();

        // Render the Inertia page and pass the classes as props
        return Inertia::render('dashboard/teacherDashboard/CreateExam', [
            'classes' => $classes->toArray(), // Pass classes data to the frontend
            // You might pass other data here if needed for the form, e.g., default metrics structure
        ]);
    }

    /**
     * Handle storing a newly created test.
     */
    public function createTest(Request $request): RedirectResponse // Return RedirectResponse
    {
        // Get the authenticated teacher
        $teacher = Auth::user()->teacher;

        // Use a Form Request for cleaner validation if this gets complex
        $validator = Validator::make($request->all(), [
            "title" => "required|string|max:255",
            "problem_statement" => "required|string",
            "due_date" => "required|date|after:now",
            "class_id" => "required|exists:classes,id",
            "metrics" => "required|json" // Validate as JSON string initially
        ]);

        // If validation fails, throw a ValidationException
        if ($validator->fails()) {
            throw ValidationException::withMessages($validator->errors()->toArray());
        }

        // Find the class and verify the teacher is assigned to it
        $class = ClassRoom::findOrFail($request->class_id);
        if ($class->teacher_id != $teacher->id) {
             // Throw a validation exception if the teacher is not assigned to the class
             throw ValidationException::withMessages([
                'class_id' => 'You are not assigned to this class.',
            ]);
        }

        try {
            // Create the Test record
            $test = Test::create([
                "teacher_id" => $teacher->id,
                "class_id" => $request->class_id,
                "title" => $request->title,
                "problem_statement" => $request->problem_statement,
                "due_date" => $request->due_date,
                "metrics" => json_decode($request->metrics, true), // Decode JSON string to array
                "status" => "Upcoming" // Set initial status
            ]);

            // Assign the test to all students in the class via the pivot table
            $studentIds = $class->students()->pluck("students.id");
            $test->students()->sync($studentIds); // Sync the test with student IDs

            // Redirect to the teacher's test list page on success
            // Assuming you will create a route named 'teacher.tests.index' for the test list
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
    
    

    // The following methods (getTests, getTestSubmissions, gradeSubmission, addFeedback, getClasses)
    // are currently designed to return JSON responses. They would need to be converted to
    // return Inertia::render() or redirect() if they are to be used in a web flow
    // rendering Inertia pages.

    // Example of how getTests might be converted to show a list page:
    // public function showTeacherTestsList(): Response
    // {
    //     $teacher = Auth::user()->teacher;
    //     $tests = Test::with(["class.department", "students.user", "submissions"]) // Eager load relationships
    //         ->where("teacher_id", $teacher->id)
    //         ->orderBy('due_date', 'asc')
    //         ->get();
    //     return Inertia::render('dashboard/teacherDashboard/TestList', [
    //         'tests' => $tests->toArray(),
    //     ]);
    // }


    // public function getTests(Request $request) { ... } // Needs conversion if used for a page
    // public function getTestSubmissions(Request $request, Test $test) { ... } // Needs conversion if used for a page
    // public function gradeSubmission(Request $request, Submission $submission) { ... } // Needs conversion if used for a web action
    // public function addFeedback(Request $request, Submission $submission) { ... } // Needs conversion if used for a web action
    // public function getClasses(Request $request) { ... } // This data is now fetched and passed by showCreateExam

}
