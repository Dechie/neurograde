<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use User;
use Teacher;
use ClassRoom;

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
        return $ths->hasMany(ClassRoom::class, 'created_by');
    }
}
