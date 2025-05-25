<?php

namespace App\Http\Controllers;

use App\Models\Test;
use App\Traits\SanitizesMarkdown;
use Illuminate\Http\Request;
use Inertia\Inertia;

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
            'due_date' => 'required|date',
            'class_id' => 'required|exists:classes,id',
        ]);

        // Sanitize markdown content
        $validated['problem_statement'] = $this->sanitizeMarkdown($validated['problem_statement']);
        $validated['input_spec'] = $this->sanitizeMarkdown($validated['input_spec']);
        $validated['output_spec'] = $this->sanitizeMarkdown($validated['output_spec']);

        // Add teacher_id from authenticated user
        $validated['teacher_id'] = auth()->user()->teacher->id;
        $validated['department_id'] = auth()->user()->teacher->department_id;
        $validated['status'] = 'Upcoming';

        $test = Test::create($validated);

        return redirect()->route('teacher.tests.show', $test->id);
    }

    // ... rest of the controller methods ...
} 