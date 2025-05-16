<?php

use App\Http\Controllers\AdminController; // Make sure to import your AdminController
use Illuminate\Support\Facades\Route;

// Admin dashboard routes protected by 'auth' and 'role:admin' middleware
Route::middleware(['auth', 'role:admin'])->prefix('admin')->group(function () {
 
    // --- Inertia Page Routes (GET requests render components) ---

    // Route for the Admin Dashboard landing page (e.g., Student List)
    // The DashboardRedirectController already handles the initial redirect to this page
    // when an admin logs in via the main login form.
    // You might still want a named route directly to this page for internal links.
    Route::get('/students', [AdminController::class, 'showStudentListPage'])->name('admin.students.index');

    // Route for the Teacher List page
    Route::get('/teachers', [AdminController::class, 'showTeacherListPage'])->name('admin.teachers.index');

    // Route for the Register Teacher page
    Route::get('/teachers/create', [AdminController::class, 'showCreateTeacherPage'])->name('admin.teachers.create');

    // Route for the Create Class page
    Route::get('/classes/create', [AdminController::class, 'showCreateClassPage'])->name('admin.classes.create');

    // Route for the Class List page
     Route::get('/classes', [AdminController::class, 'showClassListPage'])->name('admin.classes.index');

    // Route for viewing unassigned students (if it's a dedicated page)
    // If unassigned students are just a section on the StudentListPage, you might not need a separate route
     Route::get('/students/unassigned', [AdminController::class, 'showUnassignedStudentsPage'])->name('admin.students.unassigned');


    // --- Action Routes (POST/PATCH/DELETE requests handle data operations) ---

    // Route to handle creating a new teacher (called from the frontend form)
    Route::post('/teachers', [AdminController::class, 'createTeacher'])->name('admin.teachers.store');

    // Route to handle creating a new class (called from the frontend form)
    Route::post('/classes', [AdminController::class, 'createClass'])->name('admin.classes.store');

    // Route to handle assigning students to a class
    // Using PATCH is more semantically correct for updating a resource (the class)
    Route::patch('/classes/{class}/students', [AdminController::class, 'assignStudentsToClass'])->name('admin.classes.assign-students');

    // Add routes for updating/deleting teachers, classes, students if needed
    // Route::patch('/teachers/{teacher}', [AdminController::class, 'updateTeacher'])->name('admin.teachers.update');
    // Route::delete('/teachers/{teacher}', [AdminController::class, 'destroyTeacher'])->name('admin.teachers.destroy');
});


