<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Teacher;
use App\Models\Student;
use App\Models\ClassRoom;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    // ADMIN LOGIN

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        if (!$user->hasRole('admin')) {
            return response()->json(['message' => 'Unauthorized access'], 403);
        }

        $token = $user->createToken('admin-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    // ADMIN CREATE TEACHER

    public function createTeacher(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required'],
        ]);

        $user = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);
        $user->assignRole('teacher');

        $teacher = Teacher::create([
            'user_id' => $user->id,
            'created_by' => auth()->id(),
        ]);

        return response()->json([
            'message' => 'Teacher created successfully',
            'teacher' => $teacher->load('user'),
        ], 201);
    }

    // ADMIN GET TEACHERS

    public function getTeachers()
    {
        $teachers = Teacher::with(['user','classes'])->get();
        return response()->json($teachers);
    }

    // ADMIN CREATE CLASS

    public function createClass(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'teacher_id' => 'required|exists:teachers,id',
            'max_students' => 'required|integer|min:1',
        ]);

        $class = ClassRoom::create([
            'name' => $request->name,
            'teacher_id' => $request->teacher_id,
            'admin_id' => auth()->id(),
            'max_students' => $request->max_students,
            'created_by' => auth()->id(),
        ]);

        return response()->json([
            'message' => 'Class created successfully',
            'class' => $class->load('teacher.user'),
        ], 201);
    }

    // ADMIN GET CLASSES

    public function getClasses()
    {
        $classes = ClassRoom::with(['teacher.user', 'students.user'])->get();
        return response()->json($classes);
    }

    // ADMIN GET STUDENTS

    public function getStudents()
    {
        $students = Student::with(['user','classes'])->get();
        return response()->json($students);
    }

    public function assignStudentsToClass(Request $request, ClassRoom $class)
    {
        $request->validate([
            'student_ids' => 'required|array',
            'student_ids.*' => 'exists:students,id',
        ]);
    
        $attachments = [];
        foreach ($request->student_ids as $student_id) {
            $attachments[$student_id] = ['assigned' => true];
        }
    
        $class->students()->syncWithoutDetaching($attachments);
    
        return response()->json([
            'message' => 'Students assigned successfully',
            'class' => $class->load('students.user'),
        ]);
    }

    public function getUnassignedStudents()
    {
        $unassignedStudents = Student::whereDoesntHave('classes')
            ->with('user', 'department')
            ->get();
    
        return response()->json($unassignedStudents);
    }
}

