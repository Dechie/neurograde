// Import necessary types from Inertia
import { Page, PageProps as InertiaPageProps } from '@inertiajs/core';
import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

// --- Core Model Interfaces ---

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: {
        user: User;
    };
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

// Assuming your User model has first_name and last_name
export interface User {
    id: number;
    name: string;
    email: string;
    student: {
        id_number: string;
        academic_year: string;
        department: string;
        class: {
            name: string;
            department: string;
        } | null;
    };
}

export interface Department {
    id: number;
    name: string;
    // Add any other department attributes
}

export interface ClassRoom {
    id: number;
    name: string;
    department_id: number;
    // Add any other class attributes
    // Include relationships if they are eager loaded and expected in the data
    teacher?: User; // Assuming teacher relationship on ClassRoom loads the User model
    department?: Department; // Assuming department relationship on ClassRoom
    students?: Student[]; // Assuming students relationship on ClassRoom
}

export type LoginForm = {
    email?: string;
    name?: string;
    password: string;
    remember: boolean;
};

export interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}
export interface Student {
    id: number;
    user: {
        id: number;
        first_name: string;
        last_name: string;
        email: string;
    };
    department: Department;
    classes: ClassRoom[];
    id_number: string;
    academic_year: string;
    // Add any other student attributes
}

export interface Teacher extends User {
    id: number;
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
  auth: {
    user: Teacher; // Now Teacher extends User, so this is valid
  };
  [key: string]: any;
}
export interface Test {
  id: number;
  title: string;
  problem_statement: string;
  input_spec: string | null;
  output_spec: string | null;
  due_date: string;
  status: 'Upcoming' | 'Done' | string;
  teacher_id: number;
  department_id: number;
  class_id: number;
  published_at: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
  teacher?: {
    id: number;
    user: {
      name: string;
      email: string;
    };
  };
  department?: {
    id: number;
    name: string;
  };
  class?: {
    id: number;
    name: string;
  };
  submissions?: Submission[];
  class_name: string;
}
export interface PageProps {
  auth: {
    user: {
      id: number;
      name: string;
      email: string;
    };
  };
}

export interface AdminHomePageProps extends PageProps {
  authUser: {
    name: string;
  };
  studentPerDept: Array<{
    name: string;
    value: number;
  }>;
  students: Array<{
    id: number;
    user: {
      first_name: string;
      last_name: string;
      email: string;
    };
    classes: Array<{
      id: number;
      name: string;
    }>;
    department: {
      id: number;
      name: string;
    };
  }>;
  teachers: Array<{
    id: number;
    user: {
      first_name: string;
      last_name: string;
      email: string;
    };
    classes: Array<{
      id: number;
      name: string;
    }>;
    department: {
      id: number;
      name: string;
    };
  }>;
  classes: Array<{
    id: number;
    name: string;
    department: {
      id: number;
      name: string;
    };
    students: Array<{
      id: number;
    }>;
    teachers: Array<{
      id: number;
    }>;
  }>;
  assignedTeacherCount: number;
  unassignedTeacherCount: number;
  assignedStudentCount: number;
  unassignedStudentCount: number;
  [key: string]: any;
} 
export interface Submission {
  id: number;
  test_id: number;
  student_id: number;
  code_editor_text: string;
  code_file_path: string | null;
  submission_type: 'editor' | 'file';
  submission_date: string;
  status: 'pending' | 'graded';
  grade: number | null;
  feedback: string | null;
  ml_verdict_id: number | null;
  ml_verdict_string: string | null;
  ml_verdict_probabilities: {
    Accepted: number;
    'Wrong Answer': number;
    'Time Limit Exceeded': number;
    'Memory Limit Exceeded': number;
    'Runtime Error': number;
    'Compile Error': number;
    'Presentation Error': number;
  } | null;
  created_at: string;
  updated_at: string;
  test: Test;
  student: {
    id: number;
    user: {
      name: string;
      email: string;
    };
  };
  aiGradingResults?: Array<{
    id: number;
    predicted_verdict_id: number;
    predicted_verdict_string: string;
    verdict_probabilities: {
      Accepted: number;
      'Wrong Answer': number;
      'Time Limit Exceeded': number;
      'Memory Limit Exceeded': number;
      'Runtime Error': number;
      'Compile Error': number;
      'Presentation Error': number;
    };
    requested_language: string;
    created_at: string;
  }>;
}

export interface TestSubmission {
    id: number;
    title: string;
    submissions: Submission[];
}

// Page props interface
export interface TestsPageProps {
  tests: Test[]
  [key: string]: any // For Inertia compatibility
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

export interface TestResult {
    id: number;
    test: {
        title: string;
    };
    score: number | null;
    status: string;
    submission_date: string;
}

export interface Statistics {
    total_tests: number;
    completed_tests: number;
    pending_submissions: number;
    average_score: number;
}

export interface HomeProps {
    user: User;
    upcomingTests: Test[];
    recentResults: TestResult[];
    statistics: Statistics;
}

export interface AdminHomePageProps extends PageProps {
  authUser: {
    name: string;
  };
  studentPerDept: Array<{
    name: string;
    value: number;
  }>;
  students: Array<{
    id: number;
    user: {
      first_name: string;
      last_name: string;
      email: string;
    };
    classes: Array<{
      id: number;
      name: string;
    }>;
    department: {
      id: number;
      name: string;
    };
  }>;
  teachers: Array<{
    id: number;
    user: {
      first_name: string;
      last_name: string;
      email: string;
    };
    classes: Array<{
      id: number;
      name: string;
    }>;
    department: {
      id: number;
      name: string;
    };
  }>;
  classes: Array<{
    id: number;
    name: string;
    department: {
      id: number;
      name: string;
    };
    students: Array<{
      id: number;
    }>;
    teachers: Array<{
      id: number;
    }>;
  }>;
  assignedTeacherCount: number;
  unassignedTeacherCount: number;
  assignedStudentCount: number;
  unassignedStudentCount: number;
  [key: string]: any; // Add index signature
}
