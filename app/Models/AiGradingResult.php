<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Submission;
use Teacher;
class AiGradingResult extends Model
{
    //
    public function submission()
    {
        return $this->belongsTo(Submission::class);
    }

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }
}
