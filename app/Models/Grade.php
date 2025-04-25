<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Grade extends Model
{
    protected $fillable = [
        "submission_id",
        "teacher_id",
        "graded_value",
        "adjusted_grade",
        "override_reason",
        "comments"
    ];

    public function submission()
    {
        return $this->belongsTo(Submission::class);
    }

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }
}

