<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateSubmissionRequest;
use App\Models\Submission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Exception;

class SubmissionController extends Controller
{
    public function index(Submission $submission)
    {
        try {
            $this->authorize('view', $submission);
            
            $submissions = $submission->test->submissions()
                ->with(['student', 'aiGradingResults'])
                ->latest()
                ->get();

            return Inertia::render('dashboard/teacherDashboard/Submissions/Index', [
                'test' => $submission->test,
                'submissions' => $submissions
            ]);
        } catch (Exception $e) {
            Log::error('Error viewing submissions', [
                'error' => $e->getMessage(),
                'test_id' => $submission->test_id
            ]);

            return redirect()->back()->with('error', 'Failed to load submissions. Please try again.');
        }
    }

    public function show(Submission $submission)
    {
        try {
            $this->authorize('view', $submission);
            
            $submission->load(['test', 'student', 'aiGradingResults']);
            
            if (!$submission->aiGradingResults->count()) {
                return redirect()->back()->with('warning', 'This submission has not been graded by the ML system yet.');
            }

            return Inertia::render('dashboard/teacherDashboard/Submissions/Show', [
                'submission' => $submission
            ]);
        } catch (Exception $e) {
            Log::error('Error viewing submission', [
                'error' => $e->getMessage(),
                'submission_id' => $submission->id
            ]);

            return redirect()->back()->with('error', 'Failed to load submission. Please try again.');
        }
    }

    public function update(UpdateSubmissionRequest $request, Submission $submission)
    {
        try {
            $this->authorize('update', $submission);

            $validated = $request->validated();

            // Check if the submission has been graded before
            if ($submission->status === 'graded') {
                Log::info('Submission regraded', [
                    'submission_id' => $submission->id,
                    'old_grade' => $submission->grade,
                    'new_grade' => $validated['grade']
                ]);
            }

            $submission->update([
                'grade' => $validated['grade'],
                'feedback' => $validated['feedback'],
                'status' => $validated['status']
            ]);

            return redirect()->back()->with('success', 'Submission graded successfully.');
        } catch (Exception $e) {
            Log::error('Error grading submission', [
                'error' => $e->getMessage(),
                'submission_id' => $submission->id
            ]);

            return redirect()->back()
                ->with('error', 'Failed to grade submission. Please try again.')
                ->withErrors($e->getMessage());
        }
    }
} 