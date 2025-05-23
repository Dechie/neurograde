import { SubmittedExams } from '@/components/dashboard/teacherDashboard/SubmittedExams';
import { AppLayout } from '@/layouts/dashboard/teacherDashboard/teacherDashboardLayout';
import { Head } from '@inertiajs/react';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface TestSubmission {
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

interface Props {
    test?: TestSubmission;
    tests?: TestSubmission[];
}

export default function TeacherSubmittedExamPage({ test, tests }: Props) {
    // Check if we have any data to display
    if (!test && !tests) {
        return (
            <AppLayout>
                <Head title="Test Submissions" />
                <div className="container mx-auto py-6">
                    <Alert>
                        <AlertDescription>
                            No test submissions found.
                        </AlertDescription>
                    </Alert>
                </div>
            </AppLayout>
        );
    }

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
                ) : null}
            </div>
        </AppLayout>
    );
}
