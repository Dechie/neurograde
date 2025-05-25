<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Test extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'title',
        'problem_statement',
        'input_spec',
        'output_spec',
        'due_date',
        'status',
        'teacher_id',
        'department_id',
        'class_id',
        'published_at',
        'published'
    ];

    protected $casts = [
        'due_date' => 'date',
        'published_at' => 'datetime',
        'published' => 'boolean'
    ];

    protected $appends = ['grading_criteria'];

    public function getGradingCriteriaAttribute()
    {
        return GradingCriteria::getVerdicts();
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function submissions()
    {
        return $this->hasMany(Submission::class);
    }
    
    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }
    
    public function class()
    {
        return $this->belongsTo(ClassRoom::class, 'class_id');
    }

    public function students()
    {
        return $this->belongsToMany(Student::class, 'test_student', 'test_id', 'student_id');
    }
}

