<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class DashboardRedirectController extends Controller
{
    public function redirectToDashboard(Request $request)
    {
        $user = Auth::user();

        // Log comprehensive user and session information
        Log::info('Dashboard redirect attempt', [
            'user_id' => $user->id,
            'user_email' => $user->email,
            'roles' => $user->roles->pluck('name'),
            'session_id' => session()->getId(),
            'csrf_token' => $request->session()->token(),
            'is_authenticated' => Auth::check(),
            'request_method' => $request->method(),
            'request_path' => $request->path(),
            'request_ip' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        if ($user->hasRole('admin')) {
            Log::info('Redirecting admin user', ['user_id' => $user->id]);
            return redirect()->route('admin.home');
        } elseif ($user->hasRole('teacher')) {
            Log::info('Redirecting teacher user', ['user_id' => $user->id]);
            return redirect()->route('teacher.dashboard');
        } elseif ($user->hasRole('student')) {
            $student = $user->student;
            
            // Enhanced student status logging
            Log::info('Student status check', [
                'student_id' => $student->id,
                'status' => $student->status,
                'class_id' => $student->class_id,
                'has_class' => $student->class_id !== null,
                'user_id' => $user->id,
                'session_id' => session()->getId(),
                'roles' => $user->roles->pluck('name'),
                'is_authenticated' => Auth::check(),
                'request_method' => $request->method(),
                'request_path' => $request->path()
            ]);

            if ($student->status === 'assigned' && $student->class_id) {
                Log::info('Redirecting assigned student to dashboard', [
                    'student_id' => $student->id,
                    'class_id' => $student->class_id
                ]);
                return redirect()->route('student.dashboard');
            } else {
                Log::info('Redirecting unassigned student to waiting screen', [
                    'student_id' => $student->id,
                    'status' => $student->status,
                    'class_id' => $student->class_id
                ]);
                return redirect()->route('student.waiting');
            }
        }

        // Log fallback case
        Log::warning('Fallback redirect for user without specific role', [
            'user_id' => $user->id,
            'roles' => $user->roles->pluck('name')
        ]);
        return redirect()->route('dashboard');
    }
}
