<?php

namespace App\Jobs;

use App\Models\Submission;
use App\Services\AiGradingService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class GradeSubmission implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected Submission $submission;

    /**
     * Create a new job instance.
     *
     * @param Submission $submission The submission to grade.
     */
    public function __construct(Submission $submission)
    {
        $this->submission = $submission->withoutRelations(); // Avoid serializing relations
        $this->onQueue('grading'); // Set the queue name using the trait's method
    }

    /**
     * Execute the job.
     *
     * @param AiGradingService $aiGradingService
     * @return void
     */
    public function handle(AiGradingService $aiGradingService): void
    {
        try {
            // Reload the submission with its relationships if needed, as it might have been unserialized
            // For AiGradingService, we need 'test' relationship with all required fields
            $this->submission->load(['test' => function($query) {
                $query->select('id', 'problem_statement', 'input_spec', 'output_spec');
            }]);

            // Log the test data for debugging
            Log::info('Test data loaded for grading', [
                'submission_id' => $this->submission->id,
                'test_id' => $this->submission->test->id,
                'has_problem_statement' => !empty($this->submission->test->problem_statement),
                'has_input_spec' => !empty($this->submission->test->input_spec),
                'has_output_spec' => !empty($this->submission->test->output_spec),
                'problem_statement_length' => strlen($this->submission->test->problem_statement),
                'input_spec_length' => strlen($this->submission->test->input_spec),
                'output_spec_length' => strlen($this->submission->test->output_spec),
                'submission_language' => $this->submission->language
            ]);

            // Validate required fields before proceeding
            if (empty($this->submission->test->problem_statement)) {
                throw new \Exception('Test problem statement is missing');
            }
            if (empty($this->submission->test->input_spec)) {
                throw new \Exception('Test input specification is missing');
            }
            if (empty($this->submission->test->output_spec)) {
                throw new \Exception('Test output specification is missing');
            }

            $aiGradingService->gradeSubmission($this->submission);
            Log::info('AI grading job completed for submission', ['submission_id' => $this->submission->id]);
        } catch (\Exception $e) {
            Log::error('AI grading job failed for submission', [
                'submission_id' => $this->submission->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            // Update submission status to indicate grading failure
            $this->submission->update(['status' => 'ai_grading_failed']);
        }
    }
}