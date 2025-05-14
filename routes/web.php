<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DashboardRedirectController;

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

// Student dashboard routes

require __DIR__.'/web-students.php';
require __DIR__.'/web-admin.php';
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
