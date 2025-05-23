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
            // For AiGradingService, we need 'test' relationship for statement, input_spec, etc.
            $this->submission->load('test');

            $aiGradingService->gradeSubmission($this->submission);
            Log::info('AI grading job completed for submission', ['submission_id' => $this->submission->id]);
        } catch (\Exception $e) {
            Log::error('AI grading job failed for submission', [
                'submission_id' => $this->submission->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            // Optionally update submission status to indicate grading failure
            // $this->submission->update(['status' => 'ai_grading_failed']);
        }
    }
}