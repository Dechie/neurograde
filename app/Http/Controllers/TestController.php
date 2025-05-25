<?php

namespace App\Http\Controllers;

use App\Models\Test;
use App\Traits\SanitizesMarkdown;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TestController extends Controller
{
    use SanitizesMarkdown;

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'problem_statement' => 'required|string',
            'input_spec' => 'required|string',
            'output_spec' => 'required|string',
            'due_date' => 'required|date|after:now',
            'class_id' => 'required|exists:classes,id',
        ]);

        try {
            // Sanitize markdown content
            $validated['problem_statement'] = $this->sanitizeMarkdown($validated['problem_statement']);
            $validated['input_spec'] = $this->sanitizeMarkdown($validated['input_spec']);
            $validated['output_spec'] = $this->sanitizeMarkdown($validated['output_spec']);

            $teacher = Auth::user()->teacher;
            
            $test = Test::create([
                "teacher_id" => $teacher->id,
                "department_id" => $teacher->department_id,
                "class_id" => $validated['class_id'],
                "title" => $validated['title'],
                "due_date" => $validated['due_date'],
                "published" => true,
                "problem_statement" => $validated['problem_statement'],
                "input_spec" => $validated['input_spec'],
                "output_spec" => $validated['output_spec'],
            ]);

            // Get all students in the class and associate them with the test
            $studentIds = $test->class->students()->pluck('students.id');
            $test->students()->sync($studentIds);

            return response()->json([
                'message' => 'Test created successfully',
                'test' => $test
            ], 201);

        } catch (\Exception $e) {
            \Log::error('Failed to create test', [
                'error' => $e->getMessage(),
                'request' => $request->all()
            ]);
            
            return response()->json([
                'message' => 'Failed to create test',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // ... rest of the controller methods ...
} 