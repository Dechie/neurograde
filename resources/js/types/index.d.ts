// import { LucideIcon } from 'lucide-react';
// import type { Config } from 'ziggy-js';

// export type LoginForm = {
//     email?: string;
//     name?: string;
//     password: string;
//     remember: boolean;
// };

// export interface LoginProps {
//     status?: string;
//     canResetPassword: boolean;
// }
// export interface Auth {
//     user: User;
// }

// export interface BreadcrumbItem {
//     title: string;
//     href: string;
// }

// export interface NavGroup {
//     title: string;
//     items: NavItem[];
// }

// export interface NavItem {
//     title: string;
//     href: string;
//     icon?: LucideIcon | null;
//     isActive?: boolean;
// }

// export interface SharedData {
//     name: string;
//     quote: { message: string; author: string };
//     auth: Auth;
//     ziggy: Config & { location: string };
//     sidebarOpen: boolean;
//     [key: string]: unknown;
// }


// export interface TestsProps {
//     tests: Array<{
//         id: number;
//         title: string;
//         dueDate: string;
//         status: string;
//     }>;
// }
// interface Department {
//   id: number;
//   name: string;
// }
// export interface User {
//     id: number;
//     first_name: string; // Ensure this is defined
//     last_name: string;  // Ensure this is defined

//     email: string;
//     email_verified_at: string | null;
//     created_at: string;
//     updated_at: string;
//     // Add other properties you expect on the User object, like avatar, roles, student relation
//     avatar?: string; // Example if user has an avatar field
//     roles?: { name: string }[]; // Example if roles are loaded
//     student?: any; // Example if student relation is loaded
// }

// // Ensure PageProps structure matches what your backend is passing
// export interface PageProps {
//     auth: {
//         user: User | null; // 'user' can be null if the user is not authenticated
//     };
//     // Add other props like 'departments' if your pages receive them
//     departments?: { id: number; name: string }[];
//     [key: string]: any; // Catch-all for other potential props
// }

// // Add other relevant types as needed
// export interface BreadcrumbItem {
//     title: string;
//     href: string;
// }
// resources/js/types/index.d.ts (or types.ts)

// Import necessary types from Inertia
import { Page, PageProps as InertiaPageProps } from '@inertiajs/core';

// --- Core Model Interfaces ---

// Assuming your User model has first_name and last_name
export interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    // Add any other common user attributes
}

export interface Department {
    id: number;
    name: string;
    // Add any other department attributes
}

export interface ClassRoom {
    id: number;
    name: string;
    // Add any other class attributes
    // Include relationships if they are eager loaded and expected in the data
    teacher?: User; // Assuming teacher relationship on ClassRoom loads the User model
    department?: Department; // Assuming department relationship on ClassRoom
    students?: Student[]; // Assuming students relationship on ClassRoom
}

export interface Student {
    id: number;
    user: User; // Student has a user relationship
    department: Department; // Student has a department relationship
    classes: ClassRoom[]; // Student has a many-to-many relationship with ClassRoom
    id_number: string; // Assuming id_number is on the Student model
    academic_year: string; // Assuming academic_year is on the Student model
    // Add any other student attributes
}

export interface Teacher {
    id: number;
    user: User; // Teacher has a user relationship
    department: Department; // Teacher has a department relationship
    classes: ClassRoom[]; // Teacher has a many-to-many relationship with ClassRoom
    // Add any other teacher attributes
    created_by?: number; // Assuming created_by is the admin user_id
    admin?: User; // Assuming you might load the admin user who created the teacher
}

export interface AiGradingResult {
    id: number;
    graded_value: number;
    comment: string | null;
    metrics: any; // Adjust type based on actual metrics structure
    submission_date: string; // Assuming formatted date string
    status: string;
    submission: { // Assuming submission relationship is loaded
        id: number;
        test: { // Assuming test relationship on submission is loaded
            id: number;
            title: string;
        }
        submission_date: string | Date; // Allow Date object if not formatted
        status: string;
        // Add other submission properties if needed
    };
    // Add any other grading result attributes
}
export interface UnassignedStudentsPageProps {
  unassignedStudents: Student[]
  departments: Department[]
  classes: ClassRoom[]
  [key: string]: any 
}
export interface CreateExamPageProps extends PageProps {
  classes: ClassRoom[]; // Expecting an array of ClassRoom objects from the backend
  // You might also need the authenticated teacher user data if not globally shared
  auth: { // Assuming auth is a shared prop
      user: Teacher; // Assuming the authenticated user is a Teacher
  };
  [key: string]: any 
}
export interface Test {
    id: number;
    title: string;
    // Add other test attributes like description, due_date, etc.
    // Include relationships if they are eager loaded
    departments?: Department[]; // Assuming tests can be associated with departments
}


// --- Page Props Interfaces ---

// Extend Inertia's base PageProps
// Add any global props that are always available on every page (e.g., auth user)
export interface PageProps extends InertiaPageProps {
    auth: {
        user: User; // Assuming authenticated user is always available
    };
    flash?: { // Assuming flash messages are available
        success?: string;
        error?: string;
        // Add other flash message types
    };
    // Add any other global props
}

// Specific Page Props interfaces extending the base PageProps
// These include the data passed by the backend controllers

export interface CreateClassPageProps extends PageProps {
    departments: Department[]; // Props specific to the CreateClassPage
    teachers: Teacher[]; // Pass Teacher interface here, not just any[]
}

export interface StudentListPageProps extends PageProps {
    students: Student[]; // Props specific to the StudentListPage
    classes: ClassRoom[]; // Pass ClassRoom interface
    departments: Department[]; // Pass Department interface
    // unassignedStudents?: Student[]; // Include if passed separately
}

export interface TeacherListPageProps extends PageProps {
    teachers: Teacher[]; // Props specific to the TeacherListPage
    classes: ClassRoom[]; // Pass ClassRoom interface
    departments: Department[]; // Pass Department interface
}

export interface StudentRegistrationPageProps extends PageProps {
    departments: Department[]; // Props specific to the Student Registration Page
    // Add other props needed for student registration
}

// Add interfaces for other pages as needed
// export interface StudentDashboardHomePageProps extends PageProps {
//     user: User & { // You might extend User with student-specific data if loaded directly on user
//          student: Student & {
//              department: Department;
//          }
//     };
//     upcomingTests: Test[];
//     recentResults: AiGradingResult[];
// }

// export interface AdminDashboardStudentListPageProps extends PageProps {
//      students: Student[];
//      classes: ClassRoom[];
//      departments: Department[];
//      unassignedStudents?: Student[]; // If passed separately
// }

// export interface AdminDashboardTeacherListPageProps extends PageProps {
//     teachers: Teacher[];
//     classes: ClassRoom[];
//     departments: Department[];
// }

// export interface AdminDashboardCreateTeacherPageProps extends PageProps {
//     departments: Department[];
// }
