<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Test;
use App\Models\AiGradingResult;
use App\Http\Controllers\StudentController;

Route::middleware(['auth', 'role:student'])->prefix('student')->group(function () {
    Route::get('/results', [StudentController::class, 'getResults'])->name('student.results');
    Route::get('/tests', [StudentController::class, 'showTests'])->name('student.tests');
    Route::get('/tests/{test}', [StudentController::class, 'showTest'])->name('student.tests.show');
    Route::post('/tests/{test}/submit', [StudentController::class, 'submitTest'])->name('student.tests.submit');
    Route::post('/tests{id}/submitCodeFile', [StudentController::class, 'submitFile']);
    Route::post('/tests{id}/submitCodeText', [StudentController::class, 'submitCode']);
});