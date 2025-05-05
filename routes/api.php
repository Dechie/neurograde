<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Admin\AdminController;
use App\Http\Controllers\Api\Student\StudentController;

Route::prefix('admin')->group(function () {
    Route::post('/login', [AdminController::class, 'login']);

    Route::middleware(['auth:sanctum'])->group(function () {
        Route::post('/logout', [AdminController::class, 'logout']);

        Route::post('/teachers', [AdminController::class, 'createTeacher']);
        Route::get('/teachers', [AdminController::class, 'getTeachers']);

        Route::get('/students', [AdminController::class, 'getStudents']);
        Route::get('/unassigned-students', [AdminController::class, 'getUnassignedStudents']);

        Route::post('/classes', [AdminController::class, 'createClass']);
        Route::get('/classes', [AdminController::class, 'getClasses']);
        Route::post('/classes/{class}/students', [AdminController::class, 'assignStudentsToClass']);
    });
});

Route::prefix('student')->group(function () {
    Route::post('/register', [StudentController::class, 'register']);
    Route::post('/login', [StudentController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [StudentController::class, 'logout']);
        Route::get('/profile', [StudentController::class, 'profile']);
    });
});

