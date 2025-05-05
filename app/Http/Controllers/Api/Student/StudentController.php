<?php

namespace App\Http\Controllers\Api\Student;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class StudentController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required',
            'id_number' => 'required|string|unique:students',
            'academic_year' => 'required|string',
            'department_id' => 'required|exists:departments,id',
        ]);

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
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user->hasRole('student')) {
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
        return response()->json([
            'student' => $request->user()->student->load(['user', 'department', 'classes'])
        ]);
    }
}

