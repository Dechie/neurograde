<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Admin extends Model
{
    //
    protected $fillable = [
        'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function createdTeachers()
    {
        return $this->hasMany(Teacher::class, 'created_by');
    }

    public function createdClasses()
    {
        return $this->hasMany(ClassRoom::class, 'created_by');
    }
}

