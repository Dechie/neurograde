<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Submission extends Model
{
    use HasFactory;

    const STATUS_PENDING = 'pending';
    const STATUS_REVIEWED = 'reviewed';
    const STATUS_GRADED = 'graded';
    const STATUS_PUBLISHED = 'published';

    protected $fillable = [
        'test_id',
        'student_id',
        'code_editor_text',
        'code_file_path',
        'submission_type',
        'status',
        'grade',
        'feedback',
        'submission_date',
        'ai_grade',
        'teacher_grade',
        'final_grade',
        'teacher_feedback',
    ];

    protected $casts = [
        'grade' => 'float',
        'ai_grade' => 'float',
        'teacher_grade' => 'float',
        'final_grade' => 'float',
        'submission_date' => 'datetime',
    ];

    public function grades()
    {
        return $this->hasMany(Grade::class);
    }

    public function feedbacks()
    {
        return $this->hasMany(Feedback::class);
    }
    
    public function test()
    {
        return $this->belongsTo(Test::class);
    }
    
    public function student()
    {
        return $this->belongsTo(Student::class);
    }
    
    public function aiGradingResults()
    {
        return $this->hasMany(AiGradingResult::class);
    }

    public function getLatestAiGradingResult()
    {
        return $this->aiGradingResults()->latest()->first();
    }

    public function isPending()
    {
        return $this->status === self::STATUS_PENDING;
    }

    public function isReviewed()
    {
        return $this->status === self::STATUS_REVIEWED;
    }

    public function isGraded()
    {
        return $this->status === self::STATUS_GRADED;
    }

    public function isPublished()
    {
        return $this->status === self::STATUS_PUBLISHED;
    }

    // Use aiGradingResults for ML verdicts and results
}

