<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\TeacherController;

Route::middleware(['auth', 'role:teacher'])->prefix('teacher')->group(function(){
    Route::get('/show-create-exam',[TeacherController::class, 'showCreateExam'])->name('teacher.show-create-exam');
    Route::get('/show-grading', [TeacherController::class, 'showGradingPage'])->name('teacher.show-grading');
    Route::get('/show-submissions', [TeacherController::class, 'showSubmissionsPage'])->name('teacher.show-submissions');
});