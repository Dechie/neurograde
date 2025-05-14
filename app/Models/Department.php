<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Department extends Model
{
    use HasFactory;
    //
    protected $fillable = [
        "name",
    ];

    public function tests()
    {
        return $this->belongsToMany(Test::class, 'test_departments', 'department_id', 'test_id');
    }

    public function students()
    {
        return $this->hasMany(Student::class);
    }

    public function teachers()
    {
        return $this->hasMany(Teacher::class);
    }
    public function classes()
    {
        return $this->hasMany(ClassRoom::class);
    }
}

