<?php
namespace App\Http\Controllers;

use App\Http\Requests\Auth\AdminLoginRequest;
use App\Models\User; 
use App\Models\Teacher; 
use App\Models\Department;
use App\Models\ClassRoom;
use App\Models\Student;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Spatie\Permission\Models\Role;
use Inertia\Response;
use Illuminate\Validation\ValidationException;

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
        // In AdminController@showStudentListPage
        $departments = Department::all();
        $classes = ClassRoom::all();
        \Log::info('Departments fetched for StudentList', ['count' => $departments->count(), 'first_dept' => $departments->first()]);

        return Inertia::render('dashboard/adminDashboard/StudentListPage', [
            'students' => $students->toArray(),
            'classes' => $classes->toArray(),
            'departments' => $departments->toArray(),
        ]);

    }

     /**
     * Show the admin teacher list page.
     */
    public function showTeacherListPage(): Response
    {
         // Fetch teachers with their user, department, and classes relationships
        $teachers = Teacher::with(['user', 'department', 'classes.department'])->get(); // Eager load classes and their departments

        // Fetch all classes and departments for the assignment dialog/filtering
        $classes = ClassRoom::with('department')->get(); // Eager load department for display in select
        $departments = Department::all();

        return Inertia::render('dashboard/adminDashboard/TeacherListPage', [
            'teachers' => $teachers->toArray(),
            'classes' => $classes->toArray(),
            'departments' => $departments->toArray(),
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
        // Corrected eager loading to use the plural 'teachers' relationship
        // and load the nested 'user' relationship for each teacher.
        $classes = ClassRoom::with(['teachers.user', 'students.user', 'department'])->get();

        // Fetch all departments for filtering/display if needed on the class list page
        $departments = Department::all();

        return Inertia::render('dashboard/adminDashboard/ClassListPage', [ // Assuming you have a ClassListPage.tsx
            'classes' => $classes->toArray(), // Pass classes data
             // Pass departments for filtering/display
            'departments' => $departments->toArray(),
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

        return Inertia::render('dashboard/adminDashboard/UnassignedStudentsPage', [
            'unassignedStudents' => $unassignedStudents->toArray(),
            'departments' => Department::all()->toArray(),
            'classes' => ClassRoom::all()->toArray(), // Add this line to provide classes data
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
            'email' => 'required|string|email|max:255|unique:'.User::class,
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
            'max_students' => 'required|integer|min:1',
        ]);

        $class = ClassRoom::create([
            'name' => $request->name,
            'department_id' => $request->department_id,
            'admin_id' => auth()->id(),
            'max_students' => $request->max_students,
            'created_by' => auth()->id(),
        ]);

        // Redirect to the class list page after successful creation
        return redirect()->route('admin.students.index')
                         ->with('success', 'Class created successfully!'); // Add a success flash message
    }

    /**
     * Handle assigning a teacher to a class
     */
    public function assignTeacherToClass(Request $request, ClassRoom $class): RedirectResponse // Return RedirectResponse, receives ClassRoom via route model binding
    {
        // Validate the incoming teacher_id from the request body
        $request->validate([
            'teacher_id' => ['required', 'exists:teachers,id'], // Corrected: Expecting teacher_id in the request body
        ]);

        // Find the Teacher model and eager load its department
        $teacher = Teacher::with('department')->findOrFail($request->teacher_id); // Eager load teacher's department

        // Eager load the class's department if not already loaded by route model binding with('department')
        // If your route model binding doesn't automatically load department, do it here:
        // $class->load('department');


        // --- Department Matching Check ---
        if ($class->department_id !== $teacher->department_id) {
             // Throw a validation exception if the departments do not match
             // Corrected error message to refer to teacher_id
             throw ValidationException::withMessages([
                'teacher_id' => "The selected teacher ({$teacher->user->first_name} {$teacher->user->last_name}) does not belong to the same department as the class ({$class->name}).",
            ]);
        }
        // --- End Department Matching Check ---


        try {
            // --- Core Logic to Assign Single Teacher to Class (Many-to-Many) ---
            // Attach this specific teacher to the selected class.
            // syncWithoutDetaching adds the relationship if it doesn't exist,
            // and does nothing if it already exists. It does NOT detach others.
            $class->teachers()->syncWithoutDetaching([$teacher->id]);

            // If you wanted to use 'attach' and handle duplicates manually:
            // try {
            //     $class->teachers()->attach($teacher->id);
            // } catch (\Illuminate\Database\QueryException $e) {
            //     // Handle duplicate entry error if needed, or just let syncWithoutDetaching handle it
            // }
            // --- End Core Logic ---


            // Redirect back to the teacher list page
            return redirect()->route('admin.teachers.index')
                             ->with('success', "Teacher {$teacher->user->first_name} {$teacher->user->last_name} assigned to class {$class->name} successfully!"); // Add a success flash message

        } catch (\Exception $e) {
            // Log the error for debugging
            \Log::error('Failed to assign teacher to class', ['error' => $e->getMessage(), 'class_id' => $class->id, 'teacher_id' => $request->teacher_id]);

            // Redirect back with an error flash message
            return redirect()->back()
                             ->withInput() // Keep old input if needed (less relevant for this form)
                             ->with('error', 'Failed to assign teacher to class. Please try again.'); // Add an error flash message
        }
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

        // Redirect back to the student list page after successful assignment
        return redirect()->route('admin.students.index') // Corrected redirect route
                         ->with('success', 'Students assigned successfully!'); // Add a success flash message
    } 


    // Existing API methods are now handled by the Inertia rendering methods above
    // The data fetching logic is moved into the show*Page methods.
    // public function getTeachers() { ... }
    // public function getClasses() { ... }
    // public function getStudents() { ... }
    // public function getUnassignedStudents() { ... }
}

