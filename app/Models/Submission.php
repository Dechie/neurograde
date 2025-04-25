<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Submission extends Model
{
    protected $fillable = [
        "test_id",
        "submission_id",
        "submission_type",
        "code_file_path",
        "code_editor_text",
        "submission_date",
        "status"
    ];

    function grades()
    {
        return $this->hasMany(Submission::class);
    }

    function feedbacks()
    {
        return $this->hasMany(Feedback::class);
    }
}

