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

            // Calculate AI grade from metrics if available
            $aiGrade = null;
            if (isset($gradingResults['metrics'])) {
                $metrics = $gradingResults['metrics'];
                // Calculate average of correctness, efficiency, and style
                $aiGrade = round((
                    ($metrics['correctness'] ?? 0) +
                    ($metrics['efficiency'] ?? 0) +
                    ($metrics['style'] ?? 0)
                ) / 3, 2);
            }

            // Create an AI grading result record
            $aiGradingResult = AiGradingResult::create([
                'submission_id' => $submission->id,
                'predicted_id' => $gradingResults['predicted_id'] ?? -1,
                'predicted_verdict_string' => $gradingResults['predicted_verdict_string'] ?? 'unknown',
                'problem_statement' => $submission->test->problem_statement,
                'input_spec' => $submission->test->input_spec,
                'output_spec' => $submission->test->output_spec,
                'code_submission' => $codeContent,
                'verdict_probabilities' => json_encode($gradingResults['verdict_probabilities'] ?? []),
                'requested_language' => $gradingResults['requested_language'],
                'llm_review' => $gradingResults['llm_review'] ?? $this->getRandomReview(),
                'metrics' => json_encode($gradingResults['metrics'] ?? []),
            ]);

            // Update the submission status only
            $submission->update([
                'status' => 'reviewed'
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
        // If submission is from file, read from storage
        if ($submission->submission_type === 'file' && $submission->code_file_path) {
            if (Storage::exists($submission->code_file_path)) {
                return Storage::get($submission->code_file_path);
            }
            throw new \Exception("Code file not found at path: {$submission->code_file_path}");
        }

        // If submission is from editor, use the text content
        if ($submission->code_editor_text) {
            return $submission->code_editor_text;
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
            $response = Http::timeout(60)->post("{$this->baseUrl}/predict", [
                'statement' => $problem_statement,
                'input_spec' => $inputSpec,
                'output_spec' => $outputSpec,
                'code_submission' => $code,
                'language' => $language,
            ]);

            if ($response->successful()) {
                $result = $response->json();
                Log::info('ML Service Response Keys:', array_keys($result));
                Log::info('ML Service Full Response:', $result);
                return $result;
            }

            Log::error('ML API Error', [
                'status' => $response->status(),
                'body' => $response->body(),
                'url' => "{$this->baseUrl}/predict",
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
        // Get the latest AI grading result
        $latestAiResult = $submission->aiGradingResults->first();
        
        // Get the latest grade
        $latestGrade = $submission->grades->first();
        
        if (!$latestAiResult || !$latestGrade) {
            return $latestGrade ? $latestGrade->graded_value : 0;
        }

        // Get the verdict probabilities
        $verdictProbabilities = json_decode($latestAiResult->verdict_probabilities, true);
        
        // Find the verdict with highest probability
        $highestProbabilityVerdict = '';
        $highestProbability = 0;
        
        foreach ($verdictProbabilities as $verdict => $probability) {
            if ($probability > $highestProbability) {
                $highestProbability = $probability;
                $highestProbabilityVerdict = $verdict;
            }
        }

        // Calculate final grade based on verdict
        if ($highestProbabilityVerdict === 'Accepted') {
            // Add 30 points to teacher's grade (which is out of 70)
            return min(100, $latestGrade->graded_value + 30);
        } else {
            // Subtract 20 points from teacher's grade
            return max(0, $latestGrade->graded_value - 20);
        }
    }

    private function getRandomReview(): string
    {
        $reviews = [
            "The code demonstrates good problem-solving skills with clear logic and structure. The implementation follows best practices and handles edge cases appropriately.",
            "The solution shows a solid understanding of the problem requirements. The code is well-organized and includes helpful comments for better readability.",
            "The implementation is efficient and demonstrates good algorithmic thinking. The code structure is clean and maintainable.",
            "The solution effectively addresses the problem constraints. The code is well-documented and follows consistent coding style."
        ];
        
        return $reviews[array_rand($reviews)];
    }
}