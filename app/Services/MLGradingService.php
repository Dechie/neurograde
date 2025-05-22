<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MLGradingService
{
    protected $baseUrl;

    public function __construct()
    {
        $this->baseUrl = config('services.ml.base_url', 'http://localhost:5000');
    }

    public function evaluateSubmission(string $statement, string $inputSpec, string $outputSpec, string $code, string $language)
    {
        try {
            $response = Http::post("{$this->baseUrl}/predict", [
                'statement' => $statement,
                'input_spec' => $inputSpec,
                'output_spec' => $outputSpec,
                'code_submission' => $code,
                'language' => $language
            ]);

            if ($response->successful()) {
                return $response->json();
            }

            Log::error('ML API Error', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);

            return null;
        } catch (\Exception $e) {
            Log::error('ML API Exception', [
                'message' => $e->getMessage()
            ]);

            return null;
        }
    }
} 