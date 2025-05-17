<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClassRoom extends Model
{
    use HasFactory;

    protected $table = 'classes';
    
    protected $fillable = [
        'name',
        'department_id',
        'teacher_id',
        'department_id',
        'admin_id',
        'max_students',
        'created_by'
    ];

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }

    public function admin()
    {
        return $this->belongsTo(Admin::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function students()
    {
        return $this->belongsToMany(Student::class,'class_students','class_id','student_id');
    }
}

