<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Submission extends Model
{
    use HasFactory;

    protected $fillable = [
        "test_id",
        "student_id",
        "submission_type",
        "code_file_path",
        "code_editor_text",
        "submission_date",
        "statue"
    ];

    protected $casts = [
        'submission_date' => 'datetime'
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
}

