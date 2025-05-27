<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Support\Facades\Route;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Show the login page.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('auth/login');
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        // --- Add these lines temporarily for debugging ---
        if (Auth::check()) {
            \Log::info('User authenticated successfully', ['user_id' => Auth::id(), 'roles' => Auth::user()->getRoleNames()]);
        } else {
            \Log::warning('Authentication attempt failed unexpectedly after authenticate() call');
        }
        \Log::info('Intended redirect URL: ' . redirect()->intended(route('dashboard', absolute: false))->getTargetUrl());
        // --- End temporary debugging lines ---

        $request->session()->regenerate();

        // Get the user's role and redirect accordingly
        $user = Auth::user();
        if ($user->hasRole('student')) {
            return redirect()->intended(route('student.dashboard', absolute: false));
        } elseif ($user->hasRole('teacher')) {
            return redirect()->intended(route('teacher.dashboard', absolute: false));
        }

        // Fallback to home if role is not recognized
        return redirect('/');
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
