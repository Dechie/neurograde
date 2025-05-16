<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class TeacherController extends Controller
{
    public function showCreateExam() 
    {
        return Inertia::render('dashboard/teacherDashboard/CreateExam');
    }

    public function showGradingPage() 
    {
        return Inertia::render('dashboard/teacherDashboard/GradingPage');
    }

    public function showSubmissionsPage()
    {
        return Inertia::render('dashboard/teacherDashboard/GradingPage');
    }
}
