<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClassRoom extends Model
{
    public function teacher()
    {
        return $this->belongsTo(Teacher::class, "teacher_id");
    }

    public function admin()
    {
        return $this->belongsTo(Admin::class, "created_by");
    }

    public function students()
    {
        return $this->belongsToMany(Student::class, "class_students", "class_id", "student_id");
    }
}

