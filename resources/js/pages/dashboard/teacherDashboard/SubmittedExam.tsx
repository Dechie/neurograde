import { SubmittedExams } from '@/components/dashboard/teacherDashboard/SubmittedExams';
import { AppLayout } from '@/layouts/dashboard/teacherDashboard/teacherDashoboardLayout';
import { Head } from '@inertiajs/react';

interface Submission {
    id: number;
    student: {
        id: number;
        user: {
            name: string;
        };
    };
    code_editor_text?: string;
    code_file_path?: string;
    submission_type: 'editor' | 'file';
    submission_date: string;
    status: 'pending' | 'graded';
    grade?: number;
}

interface Test {
    id: number;
    title: string;
    submissions: Submission[];
}

interface Props {
    test?: Test;
    tests?: Test[];
}

export default function TeacherSubmittedExamPage({ test, tests }: Props) {
    return (
        <AppLayout>
            <Head title="Test Submissions" />
            <div className="container mx-auto py-6">
                {test ? (
                    <SubmittedExams test={test} />
                ) : tests ? (
                    <div className="space-y-6">
                        {tests.map((test) => (
                            <SubmittedExams key={test.id} test={test} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-muted-foreground">No tests found</p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
