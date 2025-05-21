<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DashboardRedirectController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\AdminController;

Route::get('/', function () {
    return Inertia::render('landing');
    //return Inertia::render('dashboard/adminDashboard/RegisterTeacher');

})->name('home');

Route::get('admin-login', function(){
    return Inertia::render('auth/admin_login');
});

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', [DashboardRedirectController::class, 'redirectToDashboard'])->name('dashboard');
});

// Student routes
Route::middleware(['auth', 'role:student'])->prefix('student')->group(function () {
    Route::get('/waiting', [StudentController::class, 'showWaitingScreen'])->name('student.waiting');
    Route::get('/check-status', [StudentController::class, 'checkStatus'])->name('student.check-status');
    // ... other student routes
});

// Admin routes
Route::middleware(['auth', 'role:admin'])->prefix('admin')->group(function () {
    Route::get('/unassigned-students', [AdminController::class, 'showUnassignedStudents'])->name('admin.unassigned-students');
    Route::post('/assign-student', [AdminController::class, 'assignStudent'])->name('admin.assign-student');
    // ... other admin routes
});

// Student dashboard routes

require __DIR__.'/web-students.php';
require __DIR__.'/web-teachers.php';
require __DIR__.'/web-admin.php';
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
