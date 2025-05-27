import { AppLayout } from '@/layouts/dashboard/teacherDashboard/teacherDashboardLayout';
import { GradingPage as GradingComponent } from '@/components/dashboard/teacherDashboard/Grading';

interface Test {
    id: number;
    title: string;
    submissions: {
        id: number;
        student: {
            id: number;
            user: {
                name: string;
                email: string;
            };
        };
        status: 'pending' | 'reviewed' | 'graded' | 'published';
        grades: {
            id: number;
            graded_value: number;
            adjusted_grade: number;
            comments: string;
            status: string;
            created_at: string;
        }[];
        latest_ai_result?: {
            predicted_verdict_string: string;
            verdict_probabilities: { [key: string]: number };
            llm_review?: string;
            metrics?: { [key: string]: number };
        };
        code_editor_text?: string;
        code_file_path?: string;
        submission_date: string;
    }[];
}

interface Props {
    tests: Test[];
}

export default function GradingPage({ tests }: Props) {
    return (
        <AppLayout title="Grading">
            <GradingComponent tests={tests} />
        </AppLayout>
    );
}
