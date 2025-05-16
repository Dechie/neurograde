<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Department;
use App\Models\Student;

class StudentAuthController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        $departments = Department::all(['id', 'name']);
        return Inertia::render('auth/register',[
            'departments' => $departments
        ]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'id_number' => 'required|string|max:255',
            'department' => 'required|integer|exists:departments,id',
            'academic_year' => 'required|string|max:255',
            ]);

        $passwordHashed = Hash::make($data["password"]);

        $user = User::create([
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'email' => $data['email'],
            'password' => $passwordHashed, 
        ]);

        $user->assignRole('student');

        $student = new Student([
            'user_id' => $user->id,
            'id_number' => $data['id_number'],
            'academic_year' => $data['academic_year'],
            'department_id' => $data['department']
        ]);

        $user->student()->save($student);
        Auth::login($user);

        return to_route('dashboard');
    }

    public function loginCreate(Request $request): Response
    {
        return Inertia::render('auth/login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
        ]);
    }

    public function loginStore(Request $request): Response
    { 
        $request->authenticate();

        $request->session()->regenerate();

        return redirect()->intended(route('dashboard', absolute: false));
    }
}
