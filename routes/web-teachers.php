<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\TeacherController;


Route::middleware(['auth', 'role:teacher'])->prefix('teacher')->group(function(){

    // Routes for Test Management
    Route::get('/tests/create', [TeacherController::class, 'showCreateExam'])->name('teacher.tests.create'); // Renders the create test form
    Route::post('/tests', [TeacherController::class, 'createTest'])->name('teacher.tests.store'); // Handles storing the test

    // Routes for Submissions and Grading (will need conversion later)
    Route::get('/show-grading', [TeacherController::class, 'showGradingPage'])->name('teacher.show-grading'); // Renders grading page (needs data fetch)
    Route::get('/show-submissions', [TeacherController::class, 'showSubmissionsPage'])->name('teacher.show-submissions'); // Renders submissions page (needs data fetch)

    // You will likely need routes to list tests for the teacher
    // Route::get('/tests', [TeacherController::class, 'showTeacherTestsList'])->name('teacher.tests.index'); // Renders the teacher's test list

    // You will likely need routes for submission review/grading actions
    // Route::get('/tests/{test}/submissions', [TeacherController::class, 'showTestSubmissionsPage'])->name('teacher.tests.submissions.index'); // Renders submissions for a test
    // Route::get('/submissions/{submission}/review', [TeacherController::class, 'showSubmissionReviewPage'])->name('teacher.submissions.review'); // Renders review page for a submission
    // Route::patch('/submissions/{submission}/grade', [TeacherController::class, 'gradeSubmission'])->name('teacher.submissions.grade'); // Handles grading action
    // Route::post('/tests/{test}/publish', [TeacherController::class, 'publishTestGrades'])->name('teacher.tests.publish'); // Handles publishing grades
});