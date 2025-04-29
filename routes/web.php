<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    // return Inertia::render('welcome');
    return Inertia::render('landing');

})->name('home');

Route::get('admin-login', function(){
    return Inertia::render('auth/admin_login');
});

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        //return Inertia::render('dashboard');
        if (auth()->user()->hasRole('admin')){
            return Inertia::render('auth/admin_login');
        } elseif (auth()->user()->hasRole("teacher")){
            return Inertia::render('dashboard');
        } elseif (auth()->user()->hasRole('student')){
            return Inertia::render('dashboard');
        }
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
