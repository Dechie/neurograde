<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Analytic extends Model
{
    protected $fillable = [
        'student_id',
        'test_id',
        'metrics',
    ];
}

