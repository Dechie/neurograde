<?php

namespace App\Http\Controllers\Api\Teacher;

use App\Http\Controllers\Controller;
use App\Models\ClassRoom;
use App\Models\Feedback;
use App\Models\Grade;
use App\Models\Submission;
use App\Models\Test;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class TeacherController extends Controller
{
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "email" => "required|email",
            "password" => "required"
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if (!Auth::attempt($request->only("email", "password"))) {
            return response()->json(["message" => "Invalid credentials"], 401);
        }

        $user = Auth::user();
        
        if (!$user->hasRole("teacher")) {
            Auth::logout();
            return response()->json(["message" => "Unauthorized access"], 403);
        }

        $token = $user->createToken("teacher-token")->plainTextToken;

        return response()->json([
            "message" => "Login successful",
            "teacher" => $user->teacher->load(["user", "department", "classes"]),
            "token" => $token
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(["message" => "Logged out successfully"]);
    }

    public function createTest(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "title" => "required|string|max:255",
            "problem_statement" => "required|string",
            "due_date" => "required|date|after:now",
            "class_id" => "required|exists:classes,id",
            "metrics" => "required|json"
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $teacher = Auth::user()->teacher;
        $class = ClassRoom::findOrFail($request->class_id);

        if ($class->teacher_id != $teacher->id) {
            return response()->json(["message" => "You are not assigned to this class"], 403);
        }

        try {
            $test = Test::create([
                "teacher_id" => $teacher->id,
                "class_id" => $request->class_id,
                "title" => $request->title,
                "problem_statement" => $request->problem_statement,
                "due_date" => $request->due_date,
                "metrics" => json_decode($request->metrics, true),
                "status" => "Upcoming"
            ]);

            $studentIds = $class->students()->pluck("students.id");
            $test->students()->sync($studentIds);

            return response()->json([
                "message" => "Test created successfully",
                "test" => $test->load(["class", "students.user"])
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                "message" => "Failed to create test",
                "error" => $e->getMessage()
            ], 500);
        }
    }

    public function getTests(Request $request)
    {
        $teacher = Auth::user()->teacher;
        
        $tests = Test::with(["class", "students.user", "submissions"])
            ->where("teacher_id", $teacher->id)
            ->orderBy('due_date', 'asc')
            ->get();

        return response()->json($tests);
    }

    public function getTestSubmissions(Request $request, Test $test)
    {
        $teacher = Auth::user()->teacher;

        if ($test->teacher_id != $teacher->id) {
            return response()->json(["message" => "Unauthorized access to this test"], 403);
        }

        $submissions = $test->submissions()
            ->with(["student.user", "grades"])
            ->get();

        return response()->json($submissions);
    }

    public function gradeSubmission(Request $request, Submission $submission)
    {
        $validator = Validator::make($request->all(), [
            "graded_value" => "required|numeric|min:0|max:100",
            "comments" => "nullable|string",
            "adjusted_grade" => "nullable|numeric|min:0|max:100",
            "override_reason" => "nullable|string|required_if:adjusted_grade,!=,null"
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $teacher = Auth::user()->teacher;

        if ($submission->test->teacher_id != $teacher->id) {
            return response()->json(["message" => "Unauthorized access to this submission"], 403);
        }

        try {
            $grade = Grade::updateOrCreate(
                ['submission_id' => $submission->id],
                [
                    'teacher_id' => $teacher->id,
                    'graded_value' => $request->graded_value,
                    'adjusted_grade' => $request->adjusted_grade ?? $request->graded_value,
                    'override_reason' => $request->override_reason,
                    'comments' => $request->comments,
                ]
            );

            $submission->update(['status' => 'graded']);

            return response()->json([
                'message' => 'Submission graded successfully',
                'grade' => $grade,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                "message" => "Failed to grade submission",
                "error" => $e->getMessage()
            ], 500);
        }
    }

    public function addFeedback(Request $request, Submission $submission)
    {
        $validator = Validator::make($request->all(), [
            "feedback_text" => "required|string",
            "annotations" => "nullable|string"
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $teacher = Auth::user()->teacher;

        if ($submission->test->teacher_id != $teacher->id) {
            return response()->json([
                "message" => "Unauthorized access to this submission"
            ], 403);
        }

        try {
            $feedback = Feedback::create([
                "submission_id" => $submission->id,
                "teacher_id" => $teacher->id,
                "feedback_text" => $request->feedback_text,
                "annotations" => $request->annotations
            ]);

            if ($submission->status != "graded") {
                $submission->update(["status" => "reviewed"]);
            }

            return response()->json([
                "message" => "Feedback added successfully",
                "feedback" => $feedback
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                "message" => "Failed to add feedback",
                "error" => $e->getMessage()
            ], 500);
        }
    }

    public function getClasses(Request $request)
    {
        $teacher = Auth::user()->teacher;
        
        $classes = $teacher->classes()
            ->with(["department", "students.user"])
            ->orderBy('name', 'asc')
            ->get();

        return response()->json($classes);
    }
}

