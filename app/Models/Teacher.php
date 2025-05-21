<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Teacher extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'created_by',
        'department_id'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, "user_id");
    }

    public function admin()
    {
        return $this->belongsTo(Admin::class, 'created_by');
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function classes(): BelongsToMany
    {
        return $this->belongsToMany(ClassRoom::class, 'class_teacher', 'teacher_id', 'class_id');
    }

    public function grades()
    {
        return $this->hasMany(Grade::class);
    }

    public function feedbacks()
    {
        return $this->hasMany(Feedback::class);
    }

    public function tests(): HasMany
    {
        return $this->hasMany(Test::class);
    }
}

