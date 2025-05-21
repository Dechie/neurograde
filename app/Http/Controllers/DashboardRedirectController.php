<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\AiGradingResult;
use App\Models\Test;

class DashboardRedirectController extends Controller
{
    //
    public function redirectToDashboard() {
        if (auth()->user()->hasRole('admin')){
            return Inertia::render('dashboard/adminDashboard/StudentListPage');
        } elseif (auth()->user()->hasRole("teacher")){
            return Inertia::render('dashboard/teacherDashboard/CreateExam');
        } elseif (auth()->user()->hasRole('student')){
            $user = auth()->user()->load('student.department');
            
            // Check if student is pending
            if ($user->student->status === 'pending') {
                return redirect()->route('student.waiting');
            }
                
            $upcomingTests = Test::all();
            
            $recentResults = AiGradingResult::all();
                
            // Transform the results for the frontend
            $formattedResults = $recentResults->map(function($result) {
                return [
                    'id' => $result->id,
                    'test' => [
                        'id' => $result->submission->test->id,
                        'title' => (string)$result->submission->test->title,
                    ],
                    'score' => (float)$result->graded_value,
                    'comment' => (string)$result->comment,
                    // Convert metrics to a simple array if it's not already
                    'metrics' => is_string($result->metrics) ? json_decode($result->metrics, true) : (array)$result->metrics,
                    'submission_date' => $result->submission->submission_date instanceof \DateTime 
                        ? $result->submission->submission_date->format('Y-m-d') 
                        : (string)$result->submission->submission_date,
                    'status' => (string)$result->submission->status,
                ];
            });

            // Return the student dashboard page with necessary data
            return Inertia::render('dashboard/studentDashboard/Home', [
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->first_name . ' ' . $user->last_name,
                        'email' => $user->email,
                        'student' => [
                            'id_number' => $user->student->id_number,
                            'academic_year' => $user->student->academic_year,
                            'department' => $user->student->department->name ?? 'Unknown'
                        ]
                    ],
                    'upcomingTests' => $upcomingTests->toArray(), // Ensure this is an array
                    'recentResults' => $formattedResults->toArray(), // Ensure this is a simple array
            ]); 
        }
    }
}
