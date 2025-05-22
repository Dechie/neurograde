export interface TestSubmission {
    id: number;
    title: string;
    submissions: Array<{
        id: number;
        student: {
            id: number;
            user: {
                name: string;
                email: string;
            };
        };
        code_editor_text?: string;
        code_file_path?: string;
        submission_type: 'editor' | 'file';
        submission_date: string;
        status: 'pending' | 'graded';
        grade?: number;
    }>;
} 