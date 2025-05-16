<?php

// namespace App\Http\Controllers;

// use App\Http\Controllers\Controller;
// use App\Models\User;
// use App\Models\Teacher;
// use App\Models\Student;
// use App\Models\ClassRoom;
// use App\Models\Department;
// use Illuminate\Http\Request;
// use Illuminate\Support\Facades\Hash;

// use App\Http\Requests\Auth\LoginRequest;
// use Illuminate\Support\Facades\Route;
// use Inertia\Inertia;
// use Illuminate\Support\Facades\Auth;
// use Illuminate\Http\RedirectResponse;

// use Inertia\Response;

// class AdminController extends Controller
// {
//     public function showLogin(Request $request): Response
//     {
//         return Inertia::render('auth/admin_login'); 
//     }

//     public function login(LoginRequest $request): RedirectResponse
//     {
//         $request->authenticate();

//         // --- Add these lines temporarily for debugging ---
//         if (Auth::check()) {
//             \Log::info('User authenticated successfully', ['user_id' => Auth::id(), 'roles' => Auth::user()->getRoleNames()]);
//         } else {
//             \Log::warning('Authentication attempt failed unexpectedly after authenticate() call');
//         }
//         \Log::info('Intended redirect URL: ' . redirect()->intended(route('dashboard', absolute: false))->getTargetUrl());
//         // --- End temporary debugging lines ---

//         $request->session()->regenerate();

//         return redirect()->intended(route('dashboard', absolute: false));
//     }

//     public function createTeacher(Request $request)
//     {
//         $request->validate([
//             'first_name' => 'required|string|max:255',
//             'last_name' => 'required|string|max:255',
//             'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
//             'password' => ['required', 'confirmed', Rules\Password::defaults()],
//             'department_id' => 'required|exists:departments,id',
//         ]);

//         $user = User::create([
//             'first_name' => $request->first_name,
//             'last_name' => $request->last_name,
//             'email' => $request->email,
//             'password' => Hash::make($request->password),
//         ]);
        
//         $role = Role::where('name', 'teacher')->where('guard_name', 'web')->first();
        
//         //$user->assignRole('teacher');
//         $user->assignRole($role);

//         $teacher = Teacher::create([
//             'user_id' => $user->id,
//             'created_by' => auth()->id(),
//             'department_id' => $request->department_id,
//         ]);

//         $user->teacher()->save($teacher);
        
//         return response()->json([
//             'message' => 'Teacher created successfully',
//             'teacher' => $teacher->load(['user', 'department']),
//         ], 201);
//     }

//     public function getTeachers()
//     {
//         $teachers = Teacher::with(['user', 'department', 'classes'])->get();
//         return response()->json($teachers);
//     }

//     public function createClass(Request $request)
//     {
//         $request->validate([
//             'name' => 'required|string|max:255',
//             'department_id' => 'required|exists:departments,id',
//             'teacher_id' => 'required|exists:teachers,id',
//             'max_students' => 'required|integer|min:1',
//         ]);

//         // Verify teacher belongs to the same department
//         $teacher = Teacher::findOrFail($request->teacher_id);
//         if ($teacher->department_id != $request->department_id) {
//             return response()->json(['message' => 'Teacher does not belong to the specified department'], 400);
//         }

//         $class = ClassRoom::create([
//             'name' => $request->name,
//             'department_id' => $request->department_id,
//             'teacher_id' => $request->teacher_id,
//             'admin_id' => auth()->id(),
//             'max_students' => $request->max_students,
//             'created_by' => auth()->id(),
//         ]);

//         return response()->json([
//             'message' => 'Class created successfully',
//             'class' => $class->load(['teacher.user', 'department']),
//         ], 201);
//     }

//     public function getClasses()
//     {
//         $classes = ClassRoom::with(['teacher.user', 'students.user', 'department'])->get();
//         return response()->json($classes);
//     }

//     public function getStudents()
//     {
//         $students = Student::with(['user', 'classes', 'department'])->get();
//         return response()->json($students);
//     }

//     public function assignStudentsToClass(Request $request, ClassRoom $class)
//     {
//         $request->validate([
//             'student_ids' => 'required|array',
//             'student_ids.*' => 'exists:students,id',
//         ]);

//         // Verify all students belong to the same department as the class
//         $invalidStudents = Student::whereIn('id', $request->student_ids)
//             ->where('department_id', '!=', $class->department_id)
//             ->exists();
            
//         if ($invalidStudents) {
//             return response()->json(['message' => 'Some students do not belong to the same department as the class'], 400);
//         }

//         $attachments = [];
//         foreach ($request->student_ids as $student_id) {
//             $attachments[$student_id] = ['assigned' => true];
//         }

//         $class->students()->syncWithoutDetaching($attachments);

//         return response()->json([
//             'message' => 'Students assigned successfully',
//             'class' => $class->load(['students.user', 'department']),
//         ]);
//     }

//     public function getUnassignedStudents()
//     {
//         $unassignedStudents = Student::whereDoesntHave('classes')
//             ->with('user', 'department')
//             ->get();
    
//         return response()->json($unassignedStudents);
//     }
// }


namespace App\Http\Controllers;

use App\Http\Requests\Auth\AdminLoginRequest;
use App\Models\User; // Import User model
use App\Models\Teacher; // Import Teacher model
use App\Models\Department; // Import Department model
use App\Models\ClassRoom; // Import ClassRoom model
use App\Models\Student; // Import Student model
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request; // Import Request
use Illuminate\Support\Facades\Hash; // Import Hash
use Illuminate\Validation\Rules; // Import Validation Rules
use Spatie\Permission\Models\Role; // Import Spatie Role
use Inertia\Response; // Import Inertia Response

class AdminController extends Controller
{
    // --- Admin Login/Logout (Remain as is, handled separately) ---

    public function showLogin(Request $request): Response
    {
        return Inertia::render('auth/admin_login');
    }

    public function login(AdminLoginRequest $request): RedirectResponse
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

        // Redirect to the main dashboard route, which DashboardRedirectController will handle
        // and redirect to the appropriate admin dashboard page (e.g., admin.students.index)
        return redirect()->intended(route('dashboard', absolute: false));
    }

    // Assuming you have a logout method for admins if needed separately from main logout
    // public function logout(Request $request): RedirectResponse
    // {
    //     Auth::guard('web')->logout(); // Or your admin guard if different

    //     $request->session()->invalidate();
    //     $request->session()->regenerateToken();

    //     return redirect()->route('admin-login'); // Redirect to admin login page after logout
    // }


    // --- Inertia Page Rendering Methods (GET requests) ---

    /**
     * Show the admin student list page.
     */
    public function showStudentListPage(): Response
    {
        // Fetch data needed for the student list page
        $students = Student::with(['user', 'classes', 'department'])->get();
        $unassignedStudents = Student::whereDoesntHave('classes')
            ->with('user', 'department')
            ->get();

        return Inertia::render('dashboard/adminDashboard/StudentListPage', [
            'students' => $students->toArray(), // Pass data as props
            'unassignedStudents' => $unassignedStudents->toArray(),
            // You might also pass departments for filtering/display
            'departments' => Department::all()->toArray(),
        ]);
    }

     /**
     * Show the admin teacher list page.
     */
    public function showTeacherListPage(): Response
    {
        // Fetch data needed for the teacher list page
        $teachers = Teacher::with(['user', 'department', 'classes'])->get();

        return Inertia::render('dashboard/adminDashboard/TeacherListPage', [
            'teachers' => $teachers->toArray(), // Pass data as props
             // You might also pass departments for filtering/display
            'departments' => Department::all()->toArray(),
        ]);
    }

    /**
     * Show the admin create teacher page.
     */
    public function showCreateTeacherPage(): Response
    {
        // Fetch data needed for the create teacher form (e.g., departments)
        $departments = Department::all();

        return Inertia::render('dashboard/adminDashboard/RegisterTeacher', [
            'departments' => $departments->toArray(), // Pass departments to the form
        ]);
    }

    /**
     * Show the admin create class page.
     */
    public function showCreateClassPage(): Response
    {
        // Fetch data needed for the create class form (e.g., departments, teachers)
        $departments = Department::all();
        $teachers = Teacher::with('user')->get(); // Get teachers to assign to classes

        return Inertia::render('dashboard/adminDashboard/CreateClassPage', [
            'departments' => $departments->toArray(),
            'teachers' => $teachers->toArray(),
        ]);
    }

     /**
     * Show the admin class list page.
     */
    public function showClassListPage(): Response
    {
        // Fetch data needed for the class list page
        $classes = ClassRoom::with(['teacher.user', 'students.user', 'department'])->get();

        return Inertia::render('dashboard/adminDashboard/TeacherListPage', [ // Assuming TeacherListPage can also show classes, or create a separate ClassListPage.tsx
            'classes' => $classes->toArray(), // Pass data as props
             // You might also pass departments for filtering/display
            'departments' => Department::all()->toArray(),
        ]);
    }

     /**
     * Show the admin unassigned students page (if separate).
     */
    public function showUnassignedStudentsPage(): Response
    {
         $unassignedStudents = Student::whereDoesntHave('classes')
            ->with('user', 'department')
            ->get();

        return Inertia::render('dashboard/adminDashboard/StudentListPage', [ // Assuming StudentListPage can handle displaying unassigned students
             'unassignedStudents' => $unassignedStudents->toArray(),
             // You might pass other data needed for this view
             'departments' => Department::all()->toArray(),
        ]);
     }


    // --- Action Methods (POST/PATCH requests) ---

    /**
     * Handle creating a new teacher.
     */
    public function createTeacher(Request $request): RedirectResponse // Return RedirectResponse
    {
        // Consider creating a dedicated Form Request for this validation
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'department_id' => 'required|exists:departments,id',
        ]);

        $user = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $role = Role::where('name', 'teacher')->where('guard_name', 'web')->first();
        $user->assignRole($role);

        $teacher = Teacher::create([
            'user_id' => $user->id,
            'created_by' => auth()->id(),
            'department_id' => $request->department_id,
        ]);

        $user->teacher()->save($teacher);

        // Redirect to the teacher list page after successful creation
        return redirect()->route('admin.teachers.index')
                         ->with('success', 'Teacher created successfully!'); // Add a success flash message
    }


    /**
     * Handle creating a new class.
     */
    public function createClass(Request $request): RedirectResponse // Return RedirectResponse
    {
         // Consider creating a dedicated Form Request for this validation
        $request->validate([
            'name' => 'required|string|max:255',
            'department_id' => 'required|exists:departments,id',
            'teacher_id' => 'required|exists:teachers,id',
            'max_students' => 'required|integer|min:1',
        ]);

        // Verify teacher belongs to the same department
        $teacher = Teacher::findOrFail($request->teacher_id);
        if ($teacher->department_id != $request->department_id) {
            // Throw a validation exception if the teacher department doesn't match
             throw \Illuminate\Validation\ValidationException::withMessages([
                'teacher_id' => 'Teacher does not belong to the specified department.',
            ]);
        }

        $class = ClassRoom::create([
            'name' => $request->name,
            'department_id' => $request->department_id,
            'teacher_id' => $request->teacher_id,
            'admin_id' => auth()->id(),
            'max_students' => $request->max_students,
            'created_by' => auth()->id(),
        ]);

        // Redirect to the class list page after successful creation
        return redirect()->route('admin.classes.index')
                         ->with('success', 'Class created successfully!'); // Add a success flash message
    }

     /**
     * Handle assigning students to a class.
     */
    public function assignStudentsToClass(Request $request, ClassRoom $class): RedirectResponse // Return RedirectResponse
    {
         // Consider creating a dedicated Form Request for this validation
        $request->validate([
            'student_ids' => 'required|array',
            'student_ids.*' => 'exists:students,id',
        ]);

        // Verify all students belong to the same department as the class
        $invalidStudentsCount = Student::whereIn('id', $request->student_ids)
            ->where('department_id', '!=', $class->department_id)
            ->count(); // Use count() instead of exists() to check if any invalid students exist

        if ($invalidStudentsCount > 0) {
             // Throw a validation exception if there are invalid students
             throw \Illuminate\Validation\ValidationException::withMessages([
                'student_ids' => 'Some students do not belong to the same department as the class.',
            ]);
        }

        $attachments = [];
        foreach ($request->student_ids as $student_id) {
            $attachments[$student_id] = ['assigned' => true]; // Assuming 'assigned' is a pivot table column
        }

        $class->students()->syncWithoutDetaching($attachments);

        // Redirect back to the class list page or the specific class view
        return redirect()->route('admin.classes.index') // Or route('admin.classes.show', $class)
                         ->with('success', 'Students assigned successfully!'); // Add a success flash message
    }


    // Existing API methods are now handled by the Inertia rendering methods above
    // The data fetching logic is moved into the show*Page methods.
    // public function getTeachers() { ... }
    // public function getClasses() { ... }
    // public function getStudents() { ... }
    // public function getUnassignedStudents() { ... }
}

