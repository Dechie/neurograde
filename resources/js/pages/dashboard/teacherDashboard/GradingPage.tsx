import { GradingPage } from '@/components/dashboard/teacherDashboard/Grading';
import { AppLayout } from '@/layouts/dashboard/teacherDashboard/teacherDashboardLayout';
import { PageProps } from '@/types';

interface Test {
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
        status: 'pending' | 'reviewed' | 'graded' | 'published';
        ai_grade?: number;
        teacher_grade?: number;
        final_grade?: number;
        ai_feedback?: string;
        teacher_feedback?: string;
        code_editor_text?: string;
        code_file_path?: string;
        submission_date: string;
    }>;
}

interface Props extends PageProps {
    tests: Test[];
}

export default function TeacherGradingPage({ tests }: Props) {
    return (
        <AppLayout title="Grade Submissions">
            <GradingPage tests={tests} />
        </AppLayout>
    );
}
