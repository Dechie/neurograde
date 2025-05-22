export interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface Student {
    id: number;
    user: {
        id: number;
        first_name: string;
        last_name: string;
        email: string;
    };
    department: {
        id: number;
        name: string;
    };
    classes: Array<{
        id: number;
        name: string;
        department_id: number;
    }>;
    id_number: string;
    academic_year: string;
}

export interface Submission {
    id: number;
    student: {
        id: number;
        user: {
            id: number;
            first_name: string;
            last_name: string;
            email: string;
        };
    };
    code_editor_text?: string;
    code_file_path?: string;
    submission_type: 'editor' | 'file';
    submission_date: string;
    created_at: string;
    status: 'pending' | 'graded';
    grade?: number;
    ml_verdict_id?: number;
    ml_verdict_string?: string;
    ml_verdict_probabilities?: {
        Accepted: number;
        'Wrong Answer': number;
        'Time Limit Exceeded': number;
        'Memory Limit Exceeded': number;
        'Runtime Error': number;
        'Compile Error': number;
        'Presentation Error': number;
    };
}