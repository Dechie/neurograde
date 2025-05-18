<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Teacher extends Model
{
   protected $fillable = [
      'user_id',
      'created_by',
      'department_id'
   ];

   public function user()
   {
      return $this->belongsTo(User::class, "user_id");
   }

   public function admin()
   {
      return $this->belongsTo(Admin::class, 'created_by');
   }

   public function department()
   {
      return $this->belongsTo(Department::class);
   }

   public function classes()
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
}

