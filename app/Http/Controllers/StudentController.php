<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Test;
use App\Models\AiGradingResult;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use App\Http\Controllers\Response;
class StudentController extends Controller
{
    //
    public function getResults()
    {
        $user = auth()->user()->load('student');
        $recentResults = AiGradingResult::whereHas('submission', function($query) use ($user) {
            $query->whereHas('test', function($testQuery) use ($user) {
                $testQuery->whereHas('students', function($studentQuery) use ($user) {
                    $studentQuery->where('students.id', $user->student->id);
                });
            });
        })
        ->with(['submission.test'])
        ->orderBy('created_at', 'desc')
        ->take(5)
        ->get();
        $formattedResults = $recentResults->map(function($result) {
            return [
                'id' => $result->id,
                'test' => [
                    'id' => $result->submission->test->id,
                    'title' => $result->submission->test->title,
                ],
                'score' => $result->graded_value,
                'comment' => $result->comment,
                'metrics' => json_decode($result->metrics, true),
                'submission_date' => $result->submission->submission_date,
                'status' => $result->submission->status,
            ];
        })->toArray();
        // $results = AiGradingResult::where('student_id', $user->student->id)
        //     ->with('test')
        //     ->orderBy('created_at', 'desc')
        //     ->paginate(10);
            
        return Inertia::render('dashboard/studentDashbord/Results', [
            'results' => $formattedResults
        ]);    
    }

    public function getTests() 
    {
        $user = auth()->user()->load('student.department');
        // $tests = Test::whereHas('departments', function($query) use ($user) {
        //     $query->where('department_id', $user->student->department_id);
        // })
        // ->get()
        // ->map(function($test) {
        //     return [
        //         'id' => $test->id,
        //         'title' => $test->title,
        //         'due_date' => $test->due_date->format('M d, Y'),
        //         'status' => $test->status,
        //         // Add other properties as needed
        //     ];
        // });

        $tests = Test::all();
            
        return Inertia::render('dashboard/studentDashbord/Tests/Index', [
            'tests' => $tests,
        ]);
    }

    public function showTest($id) {
        $user = auth()->user()->load('student');
        $test = Test::findOrFail($id);
        
        // Check if the test belongs to the student's department
        // $hasAccess = $test->departments()->where('department_id', $user->student->department_id)->exists();
        
        // if (!$hasAccess) {
        //     abort(403, 'You do not have access to this test');
        // }
        
        return Inertia::render('dashboard/studentDashbord/Tests/Show', [
            'id' => $id,
            'test' => [
                'id' => $test->id,
                'title' => $test->title,
                'problemStatement' => $test->problem_statement,
                //'dueDate' => $test->due_date->format('m d, y'),
                'dueDate' => $test->due_date,
                'status' => $test->status,
                // add other properties as needed
            ]
        ]);
    }

    public function submitFile()
    {

    }

    public function submitText()
    {

    }
}
