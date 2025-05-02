<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Test extends Model
{
    //
    use HasFactory;
    
    protected $fillable = [
        'title',
        'dueDate',
        'status',
    ];

    public function departments() {
        return $this->belongsToMany(Department::class, 'test_departments', 'test_id', 'department_id');
    }

    public function students() {
        return $this->belongsToMany(Student::class, 'test_student', 'test_id', 'student_id');
    }

    public function submissions() {
        return $this->hasMany(Submission::class);
    } 
}
