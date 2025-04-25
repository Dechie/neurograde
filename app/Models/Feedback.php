<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Feedback extends Model
{
    protected $fillable = [
        "submission_id",
        "teacher_id",
        "feedback_test",
        "annotations"
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

