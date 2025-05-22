<?php

namespace App\Services;

use App\Models\Submission;
use App\Models\AiGradingResult;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class AiGradingService
{
    public function gradeSubmission(Submission $submission)
    {
        try {
            // Get code content
            $codeContent = $this->getCodeContent($submission);

            // Call ML service to get grading results
            $gradingResults = $this->callMlService($codeContent);

            // Create AI grading result
            $aiGradingResult = AiGradingResult::create([
                'submission_id' => $submission->id,
                'grade' => $gradingResults['grade'],
                'metrics' => $gradingResults['metrics'],
                'comments' => $gradingResults['comments'],
            ]);

            // Update submission with AI grade
            $submission->update([
                'ai_grade' => $gradingResults['grade'],
                'status' => 'reviewed',
            ]);

            Log::info('AI grading completed for submission', [
                'submission_id' => $submission->id,
                'ai_grade' => $gradingResults['grade'],
            ]);

            return $aiGradingResult;
        } catch (\Exception $e) {
            Log::error('Error in AI grading', [
                'submission_id' => $submission->id,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    private function getCodeContent(Submission $submission): string
    {
        if ($submission->code_editor_text) {
            return $submission->code_editor_text;
        }

        if ($submission->code_file_path) {
            return Storage::get($submission->code_file_path);
        }

        throw new \Exception('No code content found for submission');
    }

    private function callMlService(string $codeContent): array
    {
        // TODO: Replace with actual ML service call
        // For now, return dummy data
        return [
            'grade' => rand(60, 100),
            'metrics' => [
                'correctness' => rand(60, 100),
                'efficiency' => rand(60, 100),
                'style' => rand(60, 100),
            ],
            'comments' => 'This is a placeholder for AI feedback. The actual ML service will provide detailed feedback about code quality, efficiency, and style.',
        ];
    }

    public function calculateFinalGrade(Submission $submission): float
    {
        if (!$submission->ai_grade || !$submission->teacher_grade) {
            throw new \Exception('Both AI and teacher grades are required to calculate final grade');
        }

        // Calculate weighted average (70% teacher grade, 30% AI grade)
        $finalGrade = ($submission->teacher_grade * 0.7) + ($submission->ai_grade * 0.3);
        
        // Round to 2 decimal places
        return round($finalGrade, 2);
    }
} 