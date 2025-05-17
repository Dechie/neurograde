<?php

namespace App\Http\Controllers\Api\Student;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\Submission;
use App\Models\Test;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class StudentController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|min:8',
            'id_number' => 'required|string|unique:students',
            'academic_year' => 'required|string',
            'department_id' => 'required|exists:departments,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $user = User::create([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            $user->assignRole('student');

            $student = Student::create([
                'user_id' => $user->id,
                'id_number' => $request->id_number,
                'academic_year' => $request->academic_year,
                'department_id' => $request->department_id,
            ]);

            return response()->json([
                'message' => 'Student registered successfully',
                'student' => $student->load(['user', 'department']),
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Registration failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $user = Auth::user();

        if (!$user->hasRole('student')) {
            Auth::logout();
            return response()->json(['message' => 'Unauthorized access'], 403);
        }

        $token = $user->createToken('student-token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'student' => $user->student->load(['department', 'classes']),
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }

   public function profile(Request $request)
{
    $student = $request->user()->student;

    if (!$student) {
        return response()->json([
            'message' => 'No student profile found for this user.'
        ], 404);
    }

    return response()->json([
        'student' => $student->load(['user', 'department', 'classes'])
    ]);
}


    public function getTests(Request $request)
    {
        $student = $request->user()->student;

        $tests = $student->tests()
            ->with(["teacher.user", "class"])
            ->orderBy('due_date', 'asc')
            ->get();

        return response()->json($tests);
    }

    public function submitTest(Request $request, Test $test)
    {
        $validator = Validator::make($request->all(), [
            "submission_type" => "required|in:file,editor",
            "code_file" => "required_if:submission_type,file|nullable|file|mimes:txt,py,java,cpp,js,cs,php",
            "code_editor_text" => "required_if:submission_type,editor|string"
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $student = $request->user()->student;

        if (!$student->tests()->where("test_id", $test->id)->exists()) {
            return response()->json(["message" => "You are not assigned to this test"], 403);
        }

        try {
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

            return response()->json([
                'message' => 'Test submitted successfully',
                'submission' => $submission,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to submit test',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}

