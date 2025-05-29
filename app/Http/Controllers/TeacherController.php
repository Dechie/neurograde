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
use Illuminate\Support\Facades\Log;
use App\Services\AiGradingService;
use App\Traits\SanitizesMarkdown;
use Illuminate\Support\Facades\DB;


class TeacherController extends Controller
{
    use SanitizesMarkdown;
    /**
     * Show the teacher dashboard home page.
     */
    public function showDashboard(): Response
    {
        $teacher = Auth::user()->teacher;
        
        // Get recent tests with basic stats
        $recentTests = Test::where('teacher_id', $teacher->id)
            ->with(['class', 'submissions'])
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function($test) {
                return [
                    'id' => $test->id,
                    'title' => $test->title,
                    'class' => $test->class ? $test->class->name : 'N/A',
                    'due_date' => $test->due_date->format('M j, Y'),
                    'submissions_count' => $test->submissions->count(),
                    'graded_count' => $test->submissions->where('status', 'graded')->count(),
                    'published_count' => $test->submissions->where('status', 'published')->count(),
                ];
            });

        // Get statistics
        $stats = [
            'total_tests' => Test::where('teacher_id', $teacher->id)->count(),
            'total_submissions' => Submission::whereHas('test', function($query) use ($teacher) {
                $query->where('teacher_id', $teacher->id);
            })->count(),
            'pending_grading' => Submission::whereHas('test', function($query) use ($teacher) {
                $query->where('teacher_id', $teacher->id);
            })->where('status', 'submitted')->count(),
            'classes' => $teacher->classes()->count(),
        ];

        return Inertia::render('dashboard/teacherDashboard/Home', [
            'user' => [
                'name' => Auth::user()->name,
                'email' => Auth::user()->email,
                'teacher' => [
                    'id' => $teacher->id,
                ],
            ],
            'recentTests' => $recentTests,
            'stats' => $stats,
        ]);
    }


    public function showCreateExam(): Response
    {
        $teacher = Auth::user()->teacher()->with('classes.department')->first();
        $classes = $teacher->classes;
        
        // Also fetch tests for this teacher
        $tests = Test::where('teacher_id', $teacher->id)
            ->with(['class', 'submissions'])
            ->latest()
            ->get()
            ->map(function($test) {
                return [
                    'id' => $test->id,
                    'title' => $test->title,
                    'problem_statement' => $test->problem_statement,
                    'input_spec' => $test->input_spec,
                    'output_spec' => $test->output_spec,
                    'due_date' => $test->due_date ? $test->due_date->format('Y-m-d H:i:s') : null,
                    'status' => $test->status,
                    'published' => $test->published,
                    'class' => $test->class ? [
                        'id' => $test->class->id,
                        'name' => $test->class->name,
                        'department' => $test->class->department->name,
                    ] : null,
                    'submissions_count' => $test->submissions->count(),
                    'graded_count' => $test->submissions->where('status', 'graded')->count(),
                    'published_count' => $test->submissions->where('status', 'published')->count(),
                ];
            });

        return Inertia::render('dashboard/teacherDashboard/CreateExam', [
            'classes' => $classes->toArray(),
            'tests' => $tests->toArray()
        ]);
    }

    public function updateTest(Request $request, Test $test)
    {
        // Log the incoming request data
        Log::info('Attempting to update test', [
            'test_id' => $test->id,
            'request_data' => $request->all(),
            'current_test_data' => $test->toArray()
        ]);

        // Ensure the teacher owns this test
        if ($test->teacher_id !== auth()->user()->teacher->id) {
            Log::warning('Unauthorized test update attempt', [
                'test_id' => $test->id,
                'teacher_id' => auth()->user()->teacher->id,
                'test_teacher_id' => $test->teacher_id
            ]);
            return redirect()->back()
                ->with('error', 'Unauthorized access to this test');
        }

        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'problem_statement' => 'required|string',
                'input_spec' => 'required|string',
                'output_spec' => 'required|string',
                'due_date' => 'required|date|after:now',
                'class_id' => 'required|exists:classes,id',
                'published' => 'required|boolean'
            ]);

            Log::info('Validation passed for test update', [
                'test_id' => $test->id,
                'validated_data' => $validated
            ]);

            // Sanitize markdown content
            $validated['problem_statement'] = $this->sanitizeMarkdown($validated['problem_statement']);
            $validated['input_spec'] = $this->sanitizeMarkdown($validated['input_spec']);
            $validated['output_spec'] = $this->sanitizeMarkdown($validated['output_spec']);

            // Update the test
            $test->update($validated);

            Log::info('Test updated successfully', [
                'test_id' => $test->id,
                'updated_data' => $test->fresh()->toArray()
            ]);

            return redirect()->back()
                ->with('success', 'Test updated successfully!');

        } catch (ValidationException $e) {
            Log::error('Validation failed for test update', [
                'test_id' => $test->id,
                'errors' => $e->errors(),
                'request_data' => $request->all()
            ]);

            return redirect()->back()
                ->withErrors($e->errors())
                ->withInput();
        } catch (\Exception $e) {
            Log::error('Failed to update test', [
                'error' => $e->getMessage(),
                'test_id' => $test->id,
                'request_data' => $request->all(),
                'trace' => $e->getTraceAsString(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ]);

            return redirect()->back()
                ->withInput()
                ->with('error', 'Failed to update test: ' . $e->getMessage());
        }
    }


    public function destroy(Test $test): RedirectResponse
    {
        if ($test->teacher_id !== auth()->user()->teacher->id) {
            return redirect()->back()->with('error', 'Unauthorized');
        }

        try {
            $test->submissions()->delete();
            $test->grades()->delete();
            $test->delete();

            return redirect()->route('teacher.tests.index')->with('success', 'Test deleted successfully');
        } catch (\Exception $e) {
            Log::error('Failed to delete test', [
                'error' => $e->getMessage(),
                'test_id' => $test->id,
                'trace' => $e->getTraceAsString()
            ]);

            return redirect()->back()->with('error', 'Failed to delete test');
        }
    }

    /**
     * Handle storing a newly created test.
     */
    public function createTest(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'problem_statement' => 'required|string',
            'input_spec' => 'required|string',
            'output_spec' => 'required|string',
            'due_date' => 'required|date|after:now',
            'class_id' => 'required|exists:classes,id'
        ]);

        $teacher = auth()->user()->teacher;
        $class = ClassRoom::findOrFail($request->class_id);

        // Check if the teacher is assigned to this class through the pivot table
        if (!$teacher->classes()->where('class_id', $class->id)->exists()) {
            return redirect()->back()
                ->withInput()
                ->with('error', 'You are not assigned to this class');
        }

        try {
            // Sanitize markdown content
            $validated['problem_statement'] = $this->sanitizeMarkdown($validated['problem_statement']);
            $validated['input_spec'] = $this->sanitizeMarkdown($validated['input_spec']);
            $validated['output_spec'] = $this->sanitizeMarkdown($validated['output_spec']);

            // Create the Test record
            $test = Test::create([
                "teacher_id" => $teacher->id,
                "department_id" => $teacher->department_id,
                "class_id" => $validated['class_id'],
                "title" => $validated['title'],
                'input_spec' => $validated['input_spec'],
                'output_spec' => $validated['output_spec'],
                "problem_statement" => $validated['problem_statement'],
                "due_date" => $validated['due_date'],
                "status" => "Upcoming",
                "published" => true,
                "published_at" => now()
            ]);

            // Associate the test with all students in the class
            $studentIds = $class->students()->pluck('students.id');
            $test->students()->sync($studentIds);

            // Log the created test for debugging
            Log::info('Test created successfully', [
                'test_id' => $test->id,
                'has_input_spec' => !empty($test->input_spec),
                'has_output_spec' => !empty($test->output_spec),
                'input_spec_length' => strlen($test->input_spec),
                'output_spec_length' => strlen($test->output_spec)
            ]);
             return redirect()->route('teacher.tests.create')          
               // return redirect()->route('teacher.tests.index')
                ->with('success', 'Test created successfully!');

        } catch (\Exception $e) {
            Log::error('Failed to create test', [
                'error' => $e->getMessage(),
                'request' => $request->all(),
                'trace' => $e->getTraceAsString()
            ]);

            return redirect()->back()
                ->withInput()
                ->with('error', 'Failed to create test. Please try again.');
        }
    }

    /**
     * Show the teacher's tests list page.
     */
    public function showTests(): Response
    {
        $teacher = auth()->user()->teacher;
        
        // Get all tests for this teacher with their relationships
        $tests = Test::where('teacher_id', $teacher->id)
            ->with(['class.department', 'department', 'submissions' => function($query) {
                $query->with(['student.user', 'aiGradingResults' => function($query) {
                    $query->latest();
                }]);
            }])
            ->latest()
            ->get()
            ->map(function($test) {
                return [
                    'id' => $test->id,
                    'title' => $test->title,
                    'problem_statement' => $test->problem_statement,
                    'input_spec' => $test->input_spec,
                    'output_spec' => $test->output_spec,
                    'due_date' => $test->due_date ? $test->due_date->format('Y-m-d H:i:s') : null,
                    'status' => $test->status,
                    'published' => $test->published,
                    'class' => $test->class ? [
                        'id' => $test->class->id,
                        'name' => $test->class->name,
                        'department' => $test->class->department->name,
                    ] : null,
                    'department' => $test->department ? [
                        'id' => $test->department->id,
                        'name' => $test->department->name,
                    ] : null,
                    'submissions_count' => $test->submissions->count(),
                    'graded_count' => $test->submissions->where('status', 'graded')->count(),
                    'published_count' => $test->submissions->where('status', 'published')->count(),
                ];
            });

        return Inertia::render('dashboard/teacherDashboard/Tests/Index', [
            'tests' => $tests
        ]);
    }

    public function showGradingPage()
    {
        $teacher = auth()->user()->teacher;
        
        $tests = Test::where('teacher_id', $teacher->id)
            ->with(['submissions' => function($query) {
                $query->with([
                    'student.user',
                    'grades' => function($query) {
                        $query->latest();
                    },
                    'aiGradingResults' => function($query) {
                        $query->latest();
                    }
                ]);
            }])
            ->get()
            ->map(function($test) {
                return [
                    'id' => $test->id,
                    'title' => $test->title,
                    'submissions' => $test->submissions->map(function($submission) {
                        $latestAiResult = $submission->aiGradingResults->first();
                        $latestGrade = $submission->grades->first();
                        return [
                            'id' => $submission->id,
                            'student' => [
                                'id' => $submission->student->id,
                                'user' => [
                                    'name' => $submission->student->user->first_name . ' ' . $submission->student->user->last_name,
                                    'email' => $submission->student->user->email,
                                ],
                            ],
                            'status' => $submission->status,
                            'grades' => $submission->grades->map(function($grade) {
                                return [
                                    'id' => $grade->id,
                                    'graded_value' => $grade->graded_value,
                                    'adjusted_grade' => $grade->adjusted_grade,
                                    'comments' => $grade->comments,
                                    'status' => $grade->status,
                                    'created_at' => $grade->created_at->format('Y-m-d H:i:s'),
                                ];
                            }),
                            'latest_ai_result' => $latestAiResult ? [
                                'predicted_verdict_string' => $latestAiResult->predicted_verdict_string,
                                'verdict_probabilities' => json_decode($latestAiResult->verdict_probabilities, true),
                                'llm_review' => $latestAiResult->llm_review,
                                'metrics' => json_decode($latestAiResult->metrics, true),
                            ] : null,
                            'code_editor_text' => $submission->code_editor_text,
                            'code_file_path' => $submission->code_file_path,
                            'submission_date' => $submission->submission_date,
                        ];
                    }),
                ];
            });

        return Inertia::render('dashboard/teacherDashboard/GradingPage', [
            'tests' => $tests
        ]);
    }
    public function showSubmissionsPage() { 
        $teacher = auth()->user()->teacher;
        $tests = $teacher->tests()
            ->with(['submissions.student.user'])
            ->get();

        return Inertia::render("dashboard/teacherDashboard/SubmittedExam", [
            'tests' => $tests
        ]);
    }

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

    public function showTestSubmissions($testId)
    {
        $teacher = auth()->user()->teacher;
        $test = $teacher->tests()
            ->with(['submissions.student.user'])
            ->findOrFail($testId);

        return Inertia::render('dashboard/teacherDashboard/SubmittedExam', [
            'test' => $test
        ]);
    }

    public function getSubmissions()
    {
        $teacher = auth()->user()->teacher;
        
        $submissions = Submission::whereHas('test', function($query) use ($teacher) {
            $query->where('teacher_id', $teacher->id);
        })
        ->with(['student.user', 'test', 'aiGradingResults' => function($query) {
            $query->latest();
        }])
        ->latest()
        ->get()
        ->map(function($submission) {
            return [
                'id' => $submission->id,
                'student' => [
                    'id' => $submission->student->id,
                    'name' => $submission->student->user->first_name . ' ' . $submission->student->user->last_name,
                ],
                'test' => [
                    'id' => $submission->test->id,
                    'title' => $submission->test->title,
                ],
                'status' => $submission->status,
                'submission_date' => $submission->submission_date,
                'ai_grade' => $submission->ai_grade,
                'teacher_grade' => $submission->teacher_grade,
                'final_grade' => $submission->final_grade,
                'ai_feedback' => $submission->getLatestAiGradingResult()?->comment,
                'teacher_feedback' => $submission->teacher_feedback,
            ];
        });

        return Inertia::render('dashboard/teacherDashboard/Submissions/Index', [
            'submissions' => $submissions
        ]);
    }
    
    public function showTest($testId) {
        $teacher = auth()->user()->teacher;
        $test = Test::with([
            'class',
            'department',
            'teacher'
        ]);
        return Inertia::render('dashboard/teacherDashboard/Tests/Show', [
            'test' => [
                'id' => $test->id,
                'title' => $test->title,
                'problemStatement' => $test->problem_statement,
                'dueDate' => $test->due_date,
                'status' => $test->status,
                'questionId' => $test->questionId,
                'class_id' => $test->class->id,
                'department_id' => $test->department->id,
                'class' => [
                    'id' => $test->class->id,
                    'name' => $test->class->name,
                    'department' -> $test->department->name,
                ],
                'department' => [
                    'id' => $test->department->id,
                    'name' => $test->department->name,
                ],
                'teacher' => [
                    'name' => $test->teacher->name,
                ],
                'submission' => [
                    'id' => $test->submission->id,
                    'status' => $test->submission->status,
                    'created_at' => $test->submission->created_at,
                ]
            ]
        ]);
    }

    public function showSubmission($submissionId)
    {
        $teacher = auth()->user()->teacher;
        
        // Get the submission with its relationships
        $submission = Submission::with([
            'student.user', 
            'test', 
            'grades',
            'aiGradingResults' => function($query) {
                $query->latest();
            }
        ])
        ->whereHas('test', function ($query) use ($teacher) {
            $query->where('teacher_id', $teacher->id);
        })
        ->findOrFail($submissionId);

        // Get the latest AI grading result
        $latestAiResult = $submission->getLatestAiGradingResult();

        return Inertia::render('dashboard/teacherDashboard/SubmissionDetail', [
            'submission' => [
                'id' => $submission->id,
                'student' => [
                    'id' => $submission->student->id,
                    'user' => [
                        'name' => $submission->student->user->first_name . ' ' . $submission->student->user->last_name,
                    ],
                ],
                'test' => [
                    'id' => $submission->test->id,
                    'title' => $submission->test->title,
                    'problem_statement' => $submission->test->problem_statement,
                ],
                'code_editor_text' => $submission->code_editor_text,
                'code_file_path' => $submission->code_file_path,
                'submission_type' => $submission->submission_type,
                'submission_date' => $submission->submission_date,
                'status' => $submission->status,
                'grades' => $submission->grades->map(function($grade) {
                    return [
                        'id' => $grade->id,
                        'grade' => $grade->grade,
                        'feedback' => $grade->feedback,
                        'status' => $grade->status,
                        'created_at' => $grade->created_at->format('Y-m-d H:i:s'),
                    ];
                }),
                'ai_grade' => $submission->ai_grade,
                'teacher_grade' => $submission->teacher_grade,
                'final_grade' => $submission->final_grade,
                'ai_feedback' => $latestAiResult?->llm_review ?? 'No review available',
                'teacher_feedback' => $submission->teacher_feedback,
                'ai_metrics' => $latestAiResult?->metrics ? json_decode($latestAiResult->metrics, true) : null,
                'latest_ai_result' => $latestAiResult ? [
                    'predicted_id' => $latestAiResult->predicted_id,
                    'predicted_verdict_string' => $latestAiResult->predicted_verdict_string,
                    'verdict_probabilities' => json_decode($latestAiResult->verdict_probabilities, true),
                    'metrics' => json_decode($latestAiResult->metrics, true),
                    'llm_review' => $latestAiResult->llm_review ?? 'No review available',
                ] : null,
            ]
        ]);
    }

    

    public function gradeSubmission(Request $request, $submissionId)
    {
        $validator = Validator::make($request->all(), [
            "teacher_grade" => "required|numeric|min:0|max:100",
            "teacher_feedback" => "required|string",
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator->errors());
        }

        $teacher = Auth::user()->teacher;
        $submission = Submission::with(['test', 'grades', 'aiGradingResults' => function($query) {
            $query->latest();
        }])->findOrFail($submissionId);

        if ($submission->test->teacher_id != $teacher->id) {
            return back()->with('error', 'Unauthorized access to this submission');
        }

        try {
            // Get the latest AI grade if available
            $latestAiResult = $submission->aiGradingResults->first();
            
            // Calculate final grade
            $finalGrade = app(AiGradingService::class)->calculateFinalGrade($submission);
            
            // Create a new grade record
            $grade = Grade::create([
                'submission_id' => $submission->id,
                'teacher_id' => $teacher->id,
                'graded_value' => $request->teacher_grade,
                'adjusted_grade' => $finalGrade,
                'comments' => $request->teacher_feedback,
                'status' => 'draft'
            ]);

            // Update the submission status
            $submission->update([
                'status' => 'graded'
            ]);

            Log::info('Submission graded successfully', [
                'submission_id' => $submission->id,
                'grade_id' => $grade->id,
                'teacher_grade' => $request->teacher_grade,
                'final_grade' => $finalGrade,
                'status' => 'graded'
            ]);

            // Redirect to the grades page
            return redirect()->route('teacher.show-grading')
                ->with('success', 'Submission graded successfully');

        } catch (\Exception $e) {
            Log::error('Failed to grade submission', [
                'error' => $e->getMessage(),
                'submission_id' => $submissionId,
                'trace' => $e->getTraceAsString()
            ]);

            return back()->with('error', 'Failed to grade submission. Please try again.');
        }
    }

    public function publishGrade($submissionId)
    {
        $submission = Submission::with(['student.user', 'test', 'grades' => function($query) {
            $query->latest();
        }])
            ->whereHas('test', function ($query) {
                $query->where('teacher_id', auth()->user()->teacher->id);
            })
            ->findOrFail($submissionId);

        if ($submission->status !== 'graded') {
            return redirect()->back()->with('error', 'Submission must be graded before publishing');
        }

        try {
            // Update the submission status
            $submission->update([
                'status' => 'published',
            ]);

            // Update the latest grade status
            if ($submission->grades->isNotEmpty()) {
                $latestGrade = $submission->grades->first();
                $latestGrade->update([
                    'status' => 'published'
                ]);
            }

            Log::info('Grade published for submission', [
                'submission_id' => $submission->id,
                'grade_id' => $latestGrade->id ?? null,
                'status' => 'published'
            ]);

            return redirect()->back()->with('success', 'Grade published successfully');
        } catch (\Exception $e) {
            Log::error('Error publishing grade', [
                'submission_id' => $submission->id,
                'error' => $e->getMessage(),
            ]);

            return redirect()->back()->with('error', 'Error publishing grade: ' . $e->getMessage());
        }
    }

    public function destroyTest(Test $test): RedirectResponse
    {
        // Ensure the teacher owns this test
        if ($test->teacher_id !== auth()->user()->teacher->id) {
            return redirect()->back()->with('error', 'Unauthorized access to this test');
        }

        try {
            // Start a database transaction
            DB::beginTransaction();

            // Delete related records in the correct order
            // First delete all grades for this test's submissions
            Grade::whereHas('submission', function($query) use ($test) {
                $query->where('test_id', $test->id);
            })->delete();

            // Then delete all submissions
            $test->submissions()->delete();

            // Finally delete the test
            $test->delete();

            // Commit the transaction
            DB::commit();

            return redirect()->route('teacher.tests.index')
                ->with('success', 'Test deleted successfully');
        } catch (\Exception $e) {
            // Rollback the transaction on error
            DB::rollBack();

            Log::error('Failed to delete test', [
                'error' => $e->getMessage(),
                'test_id' => $test->id,
                'trace' => $e->getTraceAsString()
            ]);

            return redirect()->back()
                ->with('error', 'Failed to delete test: ' . $e->getMessage());
        }
    }
}
