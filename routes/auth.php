<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\ConfirmablePasswordController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\EmailVerificationPromptController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\StudentAuthController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\AdminController;
use Illuminate\Support\Facades\Route;

// need to keep this post('login') route below outside the guest middleware because:
/*
The guest middleware (which is an alias for Illuminate\Auth\Middleware\RedirectIfAuthenticated) 
is designed to prevent users who are already authenticated from accessing routes meant only 
for guests (like login and registration pages). If an authenticated user hits a route with this 
middleware, they are redirected away, typically to the dashboard or home page.
*/
Route::post('login', [AuthenticatedSessionController::class, 'store'])->name('login-store');


// these two separately for admin login
Route::prefix('admin')->group(function() {
    Route::get('login', [AdminController::class, 'showLogin'])->name('admin-login');
    Route::post('store', [AdminController::class, 'login'])->name('admin-store');
});


Route::middleware('guest')->group(function () {

    Route::get('student-register', [StudentAuthController::class, 'create'])
        ->name('student-register');

    Route::post('student-register', [StudentAuthController::class, 'store'])->name('student-register.store');


    Route::get('login', [AuthenticatedSessionController::class, 'create'])
        ->name('login');

    Route::get('forgot-password', [PasswordResetLinkController::class, 'create'])
        ->name('password.request');

    Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])
        ->name('password.email');

    Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])
        ->name('password.reset');

    Route::post('reset-password', [NewPasswordController::class, 'store'])
        ->name('password.store');
});

Route::middleware('auth')->group(function () {
    Route::get('verify-email', EmailVerificationPromptController::class)
        ->name('verification.notice');

    Route::get('verify-email/{id}/{hash}', VerifyEmailController::class)
        ->middleware(['signed', 'throttle:6,1'])
        ->name('verification.verify');

    Route::post('email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('verification.send');

    Route::get('confirm-password', [ConfirmablePasswordController::class, 'show'])
        ->name('password.confirm');

    Route::post('confirm-password', [ConfirmablePasswordController::class, 'store']);

    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('logout');
});

