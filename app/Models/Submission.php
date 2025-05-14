<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class Submission extends Model
{
    use HasFactory;

    protected $fillable = [
        "test_id",
        "submission_id",
        "submission_type",
        "code_file_path",
        "code_editor_text",
        "submission_date",
        "statue"
    ];

    function grades()
    {
        return $this->hasMany(AiGradingResult::class, 'submissions_id');
    }

    function feedbacks()
    {
        return $this->hasMany(Feedback::class);
    }
    function test()
    {
        return $this->belongsTo(Test::class);
    }
}

