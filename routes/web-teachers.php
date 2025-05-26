<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\TeacherController;

Route::middleware(['auth', 'role:teacher'])->prefix('teacher')->group(function(){
     // teacher homepage
    Route::get('/teacher/dashboard', [TeacherController::class, 'showDashboard'])
         ->name('teacher.dashboard');

    // Routes for Test Management
    Route::get('/tests/create', [TeacherController::class, 'showCreateExam'])->name('teacher.tests.create'); // Renders the create test form
    Route::post('/tests', [TeacherController::class, 'createTest'])->name('teacher.tests.store'); // Handles storing the test
    Route::get('/tests', [TeacherController::class, 'showTests'])->name('teacher.tests.index');
    Route::get('/tests/{test}', [TeacherController::class, 'showTest'])->name('teacher.tests.show');

    // In your routes file (web.php or api.php)
    Route::put('/tests/{test}', [TeacherController::class, 'updateTest'])->name('teacher.tests.update');
    Route::delete('/tests/{test}', [TeacherController::class, 'destroyTest'])->name('teacher.tests.destroy');

    // Routes for Submissions
    Route::get('/submissions', [TeacherController::class, 'showSubmissions'])->name('teacher.submissions.index');
    Route::get('/tests/{test}/submissions', [TeacherController::class, 'showTestSubmissions'])->name('teacher.tests.submissions');
    Route::get('/submissions/{submissionId}', [TeacherController::class, 'showSubmission'])->name('teacher.submissions.show');
    Route::post('/submissions/{submissionId}/grade', [TeacherController::class, 'gradeSubmission'])->name('teacher.submissions.grade');

    // Routes for Submissions and Grading (will need conversion later)
    Route::get('/show-grading', [TeacherController::class, 'showGradingPage'])->name('teacher.show-grading'); // Renders grading page (needs data fetch)
    Route::get('/show-submissions', [TeacherController::class, 'showSubmissionsPage'])->name('teacher.show-submissions'); // Renders submissions page (needs data fetch)

    // You will likely need routes to list tests for the teacher
    // Route::get('/tests', [TeacherController::class, 'showTeacherTestsList'])->name('teacher.tests.index'); // Renders the teacher's test list

    // You will likely need routes for submission review/grading actions
    // Route::get('/submissions/{submission}/review', [TeacherController::class, 'showSubmissionReviewPage'])->name('teacher.submissions.review'); // Renders review page for a submission
    Route::post('/tests/{test}/publish', [TeacherController::class, 'publishGrades'])->name('teacher.tests.publish');
    Route::post('/grades/{grade}/override', [TeacherController::class, 'overrideGrade'])->name('teacher.grades.override');
});

