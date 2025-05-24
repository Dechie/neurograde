<?php

namespace App\Services;

use App\Models\Submission;
use App\Models\AiGradingResult;
use Illuminate\Support\Facades\Http; 
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class AiGradingService
{
    protected string $baseUrl;

    public function __construct()
    {
        // Use the base_url from config/services.php for the ML service

        $this->baseUrl = config('services.ml.base_url', 'https://eulmelk-neurograde-ml-module.hf.space/');
    }

    /**
     * Grades a submission using the AI (ML) service.
     *
     * @param Submission $submission The submission to be graded.
     * @return AiGradingResult The created AI grading result.
     * @throws \Exception If no code content is found or an error occurs during AI grading.
     */
    public function gradeSubmission(Submission $submission): AiGradingResult
    {
        try {
            // Get code content from the submission
            $codeContent = $this->getCodeContent($submission);

            // Log the submission details
            Log::info('Starting AI grading for submission', [
                'submission_id' => $submission->id,
                'test_id' => $submission->test->id,
                'has_test' => !is_null($submission->test),
                'test_fields' => [
                    'problem_statement' => !empty($submission->test->problem_statement),
                    'input_spec' => !empty($submission->test->input_spec),
                    'output_spec' => !empty($submission->test->output_spec),
                ],
                'field_lengths' => [
                    'problem_statement' => strlen($submission->test->problem_statement ?? ''),
                    'input_spec' => strlen($submission->test->input_spec ?? ''),
                    'output_spec' => strlen($submission->test->output_spec ?? ''),
                ],
                'submission_language' => $submission->language
            ]);

            // Ensure the submission has a related 'test' and its necessary attributes
            if (!$submission->test) {
                throw new \Exception('Submission is not linked to a test.');
            }

            // Validate required test fields
            if (empty($submission->test->problem_statement)) {
                throw new \Exception('Test problem statement is missing.');
            }
            if (empty($submission->test->input_spec)) {
                throw new \Exception('Test input specification is missing.');
            }
            if (empty($submission->test->output_spec)) {
                throw new \Exception('Test output specification is missing.');
            }

            // Call the ML service to get grading results
            $gradingResults = $this->callMlService(
                $submission->test->problem_statement,
                $submission->test->input_spec,
                $submission->test->output_spec,
                $codeContent,
                $submission->language // Use the submission's language
            );

            // Handle cases where the ML service might return null (e.g., API error)
            if (is_null($gradingResults)) {
                throw new \Exception('ML service returned no grading results.');
            }

            // Create an AI grading result record
            $aiGradingResult = AiGradingResult::create([
                'submission_id' => $submission->id,
                'predicted_verdict_id' => $gradingResults['predicted_verdict_id'] ?? null,
                'predicted_verdict_string' => $gradingResults['predicted_verdict_string'] ?? 'unknown',
                'problem_statement' => $submission->test->problem_statement,
                'input_spec' => $submission->test->input_spec,
                'output_spec' => $submission->test->output_spec,
                'code_submission' => $codeContent,
                'verdict_probabilities' => json_encode($gradingResults['verdict_probabilities'] ?? []), // Store as JSON string
                'requested_language' => $gradingResults['requested_language'], // Use the submission's language
            ]);

            // Update the submission with the AI grading results
            $submission->update([
                'ml_verdict_id' => $gradingResults['ml_verdict_id'] ?? null,
                'ml_verdict_string' => $gradingResults['ml_verdict_string'] ?? 'unknown',
                'ml_verdict_probabilities' => json_encode($gradingResults['ml_verdict_probabilities'] ?? []),
                'status' => 'reviewed', // Assuming 'reviewed' status after AI grading
            ]);

            Log::info('AI grading completed for submission', [
                'submission_id' => $submission->id,
                'ml_verdict' => $gradingResults['ml_verdict_string'] ?? 'unknown',
                'verdict_id' => $gradingResults['ml_verdict_id'] ?? null,
                'language' => $submission->language
            ]);

            return $aiGradingResult;
        } catch (\Exception $e) {
            Log::error('Error in AI grading', [
                'submission_id' => $submission->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'test_data' => [
                    'test_id' => $submission->test->id ?? null,
                    'has_problem_statement' => !empty($submission->test->problem_statement ?? ''),
                    'has_input_spec' => !empty($submission->test->input_spec ?? ''),
                    'has_output_spec' => !empty($submission->test->output_spec ?? ''),
                ],
                'submission_language' => $submission->language
            ]);
            throw $e; // Re-throw the exception to be handled upstream
        }
    }

    /**
     * Retrieves the code content from the submission.
     *
     * @param Submission $submission The submission object.
     * @return string The code content.
     * @throws \Exception If no code content is found.
     */
    private function getCodeContent(Submission $submission): string
    {
        if ($submission->code_editor_text) {
            return $submission->code_editor_text;
        }

        if ($submission->code_file_path) {
            // Ensure the file exists before attempting to read
            if (Storage::exists($submission->code_file_path)) {
                return Storage::get($submission->code_file_path);
            }
            throw new \Exception("Code file not found at path: {$submission->code_file_path}");
        }

        throw new \Exception('No code content found for submission');
    }

    /**
     * Calls the external ML service to get grading predictions.
     *
     * @param string $statement The problem statement.
     * @param string $inputSpec The input specification.
     * @param string $outputSpec The output specification.
     * @param string $code The submitted code.
     * @param string $language The language of the submitted code.
     * @return array|null The JSON response from the ML service, or null on failure.
     */
    private function callMlService(
        string $problem_statement,
        string $inputSpec,
        string $outputSpec,
        string $code,
        string $language
    ): ?array {
        try {
            $response = Http::timeout(60)->post("{$this->baseUrl}/predict", [ // Added timeout for robustness
                'statement' => $problem_statement,
                'input_spec' => $inputSpec,
                'output_spec' => $outputSpec,
                'code_submission' => $code,
                'language' => $language,
            ]);

            if ($response->successful()) {
                return $response->json();
            }

            Log::error('ML API Error', [
                'status' => $response->status(),
                'body' => $response->body(),
                'url' => "{$this->baseUrl}/predict", // Add URL for debugging
            ]);

            return null;
        } catch (\Exception $e) {
            Log::error('ML API Exception', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return null;
        }
    }

    /**
     * Calculates the final grade for a submission based on AI and teacher grades.
     *
     * @param Submission $submission The submission object.
     * @return float The calculated final grade.
     * @throws \Exception If either AI or teacher grade is missing.
     */
    public function calculateFinalGrade(Submission $submission): float
    {
        // Assuming 'ai_grade' is where the ML verdict is converted to a numeric grade if needed
        // and 'teacher_grade' is a numeric grade.
        // If 'ml_verdict_id' or 'ml_verdict_string' is used instead of 'ai_grade',
        // you'll need to define a conversion logic from verdict to a numeric grade.
        // For now, I'm sticking to the 'ai_grade' property that was in your original 'AiGradingService'.
        if (is_null($submission->ai_grade) || is_null($submission->teacher_grade)) {
            throw new \Exception('Both AI and teacher grades are required to calculate final grade');
        }

        // Calculate weighted average (70% teacher grade, 30% AI grade)
        $finalGrade = ($submission->teacher_grade * 0.7) + ($submission->ai_grade * 0.3);

        // Round to 2 decimal places
        return round($finalGrade, 2);
    }
}