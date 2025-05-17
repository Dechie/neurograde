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
        'due_date',
        'status',
        'teacher_id',
        'class_id',
        'metrics'
    ];

    protected $casts = [
        'metrics' => 'array',
        'due_date' => 'date'
    ];

    public function departments()
    {
        return $this->belongsToMany(Department::class, 'test_departments');
    }

    public function students()
    {
        return $this->belongsToMany(Student::class, 'test_student');
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
}

