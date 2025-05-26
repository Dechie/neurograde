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
use App\Models\Test;
use App\Models\ClassModel;

class AdminController extends Controller
{
    // --- Admin Login/Logout (Remain as is, handled separately) ---
    public function showAdminHome(): Response
    {
        return Inertia::render('dashboard/adminDashboard/Home');
    }

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
        // Fetch all students with their relationships
        $students = Student::with(['user', 'classes', 'department'])->get();
        
        // Get unassigned students count using a separate query
        $unassignedCount = Student::whereDoesntHave('classes')->count();
        
        // Log the counts for debugging
        \Log::info('Total students fetched', ['count' => $students->count()]);
        \Log::info('Unassigned students count', ['count' => $unassignedCount]);

        $departments = Department::all();
        $classes = ClassRoom::all();

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

        return Inertia::render('dashboard/adminDashboard/CreateClassPage', [ // Assuming you have a ClassListPage.tsx
            'classes' => $classes->toArray(), // Pass classes data
             // Pass departments for filtering/display
            'departments' => $departments->toArray(),
        ]);
    } 
//     public function showCreateClassPage(): Response
// {
//     // Fetch all classes with their relationships
//     $classes = ClassRoom::with(['department', 'teachers.user', 'students.user'])
//         ->get()
//         ->map(function ($class) {
//             return [
//                 'id' => $class->id,
//                 'name' => $class->name,
//                 'max_students' => $class->max_students,
//                 'department' => [
//                     'id' => $class->department->id,
//                     'name' => $class->department->name,
//                 ],
//                 'teachers' => $class->teachers->map(function ($teacher) {
//                     return [
//                         'id' => $teacher->id,
//                         'user' => [
//                             'first_name' => $teacher->user->first_name,
//                             'last_name' => $teacher->user->last_name,
//                             'email' => $teacher->user->email,
//                         ]
//                     ];
//                 }),
//                 'students' => $class->students->map(function ($student) {
//                     return [
//                         'id' => $student->id,
//                         'user' => [
//                             'first_name' => $student->user->first_name,
//                             'last_name' => $student->user->last_name,
//                         ]
//                     ];
//                 }),
//             ];
//         });

//     $departments = Department::all();
//     $teachers = Teacher::with('user')->get();

//     return Inertia::render('dashboard/adminDashboard/CreateClassPage', [
//         'classes' => $classes,
//         'departments' => $departments,
//         'teachers' => $teachers,
//     ]);
// }
    

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

    
    public function showUnassignedStudents()
    {
        $students = Student::with('user')
            ->where('status', 'pending')
            ->get();
            
        $classes = ClassRoom::with('department')->get();

        return Inertia::render('dashboard/adminDashboard/UnassignedStudents', [
            'students' => $students,
            'classes' => $classes
        ]);
    }

    public function assignStudent(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'class_id' => 'required|exists:classes,id'
        ]);

        $student = Student::findOrFail($validated['student_id']);
        $class = ClassRoom::findOrFail($validated['class_id']);

        // Assign student to class
        $student->classes()->attach($class->id);
        
        // Update student status
        $student->update(['status' => 'assigned']);

        return response()->json(['message' => 'Student assigned successfully']);
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
            'created_by' => optional(auth())->id(),
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
            'admin_id' => Auth::id(),
            'max_students' => $request->max_students,
            'created_by' => optional(auth())->id(),
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
     public function assignStudentsToClass(Request $request, ClassRoom $class): RedirectResponse
    {
        $request->validate([
            'student_ids' => 'required|array',
            'student_ids.*' => 'exists:students,id',
        ]);

        // Verify all students belong to the same department as the class
        $invalidStudentsCount = Student::whereIn('id', $request->student_ids)
            ->where('department_id', '!=', $class->department_id)
            ->count();

        if ($invalidStudentsCount > 0) {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'student_ids' => 'Some students do not belong to the same department as the class.',
            ]);
        }

        // Prepare attachments with assigned flag
        $attachments = [];
        foreach ($request->student_ids as $student_id) {
            $attachments[$student_id] = ['assigned' => true];
        }

        // Use syncWithoutDetaching for efficient relationship management
        $class->students()->syncWithoutDetaching($attachments);

        // Update student statuses in a single query
        Student::whereIn('id', $request->student_ids)
            ->update(['status' => 'assigned']);

        return redirect()->route('admin.students.index')
            ->with('success', 'Students assigned successfully!');
    } 

    /**
     * Show the admin dashboard home page.
     */
    // public function showHomePage()
    // {
    //     $students = Student::with(['user', 'classes', 'department'])->get();
    //     $teachers = Teacher::with(['user', 'classes', 'department'])->get();
    //     $classes = ClassRoom::with(['department', 'students', 'teachers'])->get();

    //     // Get student count per department
    //     $studentPerDept = Student::with('department')
    //         ->get()
    //         ->groupBy('department.name')
    //         ->map(function ($students) {
    //             return [
    //                 'name' => $students->first()->department->name,
    //                 'value' => $students->count()
    //             ];
    //         })
    //         ->values()
    //         ->toArray();

    //     // Count assigned/unassigned teachers
    //     $assignedTeacherCount = Teacher::whereHas('classes')->count();
    //     $unassignedTeacherCount = Teacher::whereDoesntHave('classes')->count();

    //     // Count assigned/unassigned students
    //     $assignedStudentCount = Student::whereHas('classes')->count();
    //     $unassignedStudentCount = Student::whereDoesntHave('classes')->count();

    //     return Inertia::render('Dashboard/AdminDashboard/Home', [
    //         'authUser' => auth()->user(),
    //         'studentPerDept' => $studentPerDept,
    //         'students' => $students,
    //         'teachers' => $teachers,
    //         'classes' => $classes,
    //         'assignedTeacherCount' => $assignedTeacherCount,
    //         'unassignedTeacherCount' => $unassignedTeacherCount,
    //         'assignedStudentCount' => $assignedStudentCount,
    //         'unassignedStudentCount' => $unassignedStudentCount,
    //     ]);
    // }
    public function showHomePage(): Response
{
    // Get student count per department
    $studentPerDept = Student::with('department')
        ->get()
        ->groupBy('department.name')
        ->map(function ($students, $deptName) {
            return [
                'name' => $deptName,
                'value' => $students->count()
            ];
        })
        ->values()
        ->toArray();

    // Get all data with proper relationships
    $students = Student::with(['user', 'classes', 'department'])->get()->map(function ($student) {
        return [
            'id' => $student->id,
            'user' => [
                'first_name' => $student->user->first_name,
                'last_name' => $student->user->last_name,
                'email' => $student->user->email,
            ],
            'classes' => $student->classes->map(function ($class) {
                return [
                    'id' => $class->id,
                    'name' => $class->name,
                ];
            }),
            'department' => [
                'id' => $student->department->id,
                'name' => $student->department->name,
            ],
        ];
    });

    $teachers = Teacher::with(['user', 'classes', 'department'])->get()->map(function ($teacher) {
        return [
            'id' => $teacher->id,
            'user' => [
                'first_name' => $teacher->user->first_name,
                'last_name' => $teacher->user->last_name,
                'email' => $teacher->user->email,
            ],
            'classes' => $teacher->classes->map(function ($class) {
                return [
                    'id' => $class->id,
                    'name' => $class->name,
                ];
            }),
            'department' => [
                'id' => $teacher->department->id,
                'name' => $teacher->department->name,
            ],
        ];
    });

    $classes = ClassRoom::with(['department', 'students', 'teachers'])->get()->map(function ($class) {
        return [
            'id' => $class->id,
            'name' => $class->name,
            'department' => [
                'id' => $class->department->id,
                'name' => $class->department->name,
            ],
            'students' => $class->students->map(function ($student) {
                return ['id' => $student->id];
            }),
            'teachers' => $class->teachers->map(function ($teacher) {
                return ['id' => $teacher->id];
            }),
        ];
    });

    // Count assigned/unassigned
    $assignedTeacherCount = Teacher::whereHas('classes')->count();
    $unassignedTeacherCount = Teacher::whereDoesntHave('classes')->count();
    $assignedStudentCount = Student::whereHas('classes')->count();
    $unassignedStudentCount = Student::whereDoesntHave('classes')->count();

    return Inertia::render('dashboard/adminDashboard/Home', [
        'authUser' => [
            'name' => Auth::user()->name, // Make sure your User model has a name attribute
        ],
        'studentPerDept' => $studentPerDept,
        'students' => $students,
        'teachers' => $teachers,
        'classes' => $classes,
        'assignedTeacherCount' => $assignedTeacherCount,
        'unassignedTeacherCount' => $unassignedTeacherCount,
        'assignedStudentCount' => $assignedStudentCount,
        'unassignedStudentCount' => $unassignedStudentCount,
    ]);
}

    // Existing API methods are now handled by the Inertia rendering methods above
    // The data fetching logic is moved into the show*Page methods.
    // public function getTeachers() { ... }
    // public function getClasses() { ... }
    // public function getStudents() { ... }
    // public function getUnassignedStudents() { ... }
}

