<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GradingCriteria extends Model
{
    protected $fillable = [
        'name',
        'description',
        'verdict_id'
    ];

    public static function getVerdicts()
    {
        return [
            0 => "Accepted",
            1 => "Wrong Answer",
            2 => "Time Limit Exceeded",
            3 => "Memory Limit Exceeded",
            4 => "Runtime Error",
            5 => "Compile Error",
            6 => "Presentation Error",
            -1 => "Unknown Verdict ID",
        ];
    }
} 