<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    //
    protected $fillable = [
        "name",
    ];

    public function tests() {
        return $this->belongsToMany(Test::class, 'test_departments', 'department_id', 'test_id');
    }

   
}
