<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AiGradingResult extends Model
{
    use HasFactory;

    protected $fillable = [
        'submission_id',
        'predicted_id',
        'predicted_verdict_string',
        'verdict_probabilities',
        'requested_language',
        'code_submission',
        'problem_statement',
        'input_spec',
        'output_spec'
    ];

    protected $casts = [
        'verdict_probabilities' => 'array'
    ];

    protected $appends = ['verdict_match', 'verdict_explanation'];

    public function submission()
    {
        return $this->belongsTo(Submission::class);
    }

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }

    public function getVerdictMatchAttribute()
    {
        $globalVerdicts = GradingCriteria::getVerdicts();
        $predictedVerdict = $this->predicted_verdict_string;
        
        // Check if the predicted verdict exists in global criteria
        return in_array($predictedVerdict, $globalVerdicts);
    }

    public function getVerdictExplanationAttribute()
    {
        $globalVerdicts = GradingCriteria::getVerdicts();
        $predictedVerdict = $this->predicted_verdict_string;
        
        if (!$this->verdict_match) {
            return "The predicted verdict '{$predictedVerdict}' is not recognized in the global grading criteria.";
        }

        // Get the description from the global criteria
        $criteria = GradingCriteria::where('name', $predictedVerdict)->first();
        if ($criteria) {
            return $criteria->description;
        }

        return "The predicted verdict matches global criteria but no description is available.";
    }

    public function getHighestProbabilityVerdict()
    {
        if (empty($this->verdict_probabilities)) {
            return null;
        }

        $probabilities = $this->verdict_probabilities;
        arsort($probabilities);
        return [
            'verdict' => key($probabilities),
            'probability' => reset($probabilities)
        ];
    }

    public function getVerdictConfidence()
    {
        $highest = $this->getHighestProbabilityVerdict();
        if (!$highest) {
            return 0;
        }

        return $highest['probability'] * 100;
    }

    public function isConfidentVerdict($threshold = 0.7)
    {
        return $this->getVerdictConfidence() >= ($threshold * 100);
    }
}

