<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Teacher;
use App\Models\Student;
use App\Models\ClassRoom;
use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
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

    public function createTeacher(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'department_id' => 'required|exists:departments,id',
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
            'department_id' => $request->department_id,
        ]);

        $user->teacher()->save($teacher);
        
        return response()->json([
            'message' => 'Teacher created successfully',
            'teacher' => $teacher->load(['user', 'department']),
        ], 201);
    }

    public function getTeachers()
    {
        $teachers = Teacher::with(['user', 'department', 'classes'])->get();
        return response()->json($teachers);
    }

    public function createClass(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'department_id' => 'required|exists:departments,id',
            'teacher_id' => 'required|exists:teachers,id',
            'max_students' => 'required|integer|min:1',
        ]);

        // Verify teacher belongs to the same department
        $teacher = Teacher::findOrFail($request->teacher_id);
        if ($teacher->department_id != $request->department_id) {
            return response()->json(['message' => 'Teacher does not belong to the specified department'], 400);
        }

        $class = ClassRoom::create([
            'name' => $request->name,
            'department_id' => $request->department_id,
            'teacher_id' => $request->teacher_id,
            'admin_id' => auth()->id(),
            'max_students' => $request->max_students,
            'created_by' => auth()->id(),
        ]);

        return response()->json([
            'message' => 'Class created successfully',
            'class' => $class->load(['teacher.user', 'department']),
        ], 201);
    }

    public function getClasses()
    {
        $classes = ClassRoom::with(['teacher.user', 'students.user', 'department'])->get();
        return response()->json($classes);
    }

    public function getStudents()
    {
        $students = Student::with(['user', 'classes', 'department'])->get();
        return response()->json($students);
    }

    public function assignStudentsToClass(Request $request, ClassRoom $class)
    {
        $request->validate([
            'student_ids' => 'required|array',
            'student_ids.*' => 'exists:students,id',
        ]);

        // Verify all students belong to the same department as the class
        $invalidStudents = Student::whereIn('id', $request->student_ids)
            ->where('department_id', '!=', $class->department_id)
            ->exists();
            
        if ($invalidStudents) {
            return response()->json(['message' => 'Some students do not belong to the same department as the class'], 400);
        }

        $attachments = [];
        foreach ($request->student_ids as $student_id) {
            $attachments[$student_id] = ['assigned' => true];
        }

        $class->students()->syncWithoutDetaching($attachments);

        return response()->json([
            'message' => 'Students assigned successfully',
            'class' => $class->load(['students.user', 'department']),
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

