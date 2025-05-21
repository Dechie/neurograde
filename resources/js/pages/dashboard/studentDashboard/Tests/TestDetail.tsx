import { CodeEditor } from '@/components/dashboard/studentDashboard/CodeEditor';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AppLayout } from '@/layouts/dashboard/studentDashboard/studentDashboardLayout';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface TestDetailProps {
    test: {
        id: number;
        title: string;
        problemStatement: string;
        dueDate: string;
        status: string;
        gradingCriteria: Record<number, string>;
        class?: {
            name: string;
            department: string;
        };
        teacher?: {
            name: string;
        };
    };
    submission?: {
        id: number;
        status: string;
        created_at: string;
    };
    submissionWarning?: string;
}

export default function TestDetail({ test, submission, submissionWarning }: TestDetailProps) {
    return (
        <AppLayout title="Test">
            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>{test.title}</CardTitle>
                            <CardDescription>
                                {test.class?.name} • {test.class?.department}
                                {test.teacher && <span> • Teacher: {test.teacher.name}</span>}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="prose max-w-none">
                            <p className="text-black">{test.problemStatement}</p>
                        </CardContent>
                        <CardFooter className="mt-auto border-t p-4">
                            <p className="text-muted-foreground text-sm">Due Date: {test.dueDate}</p>
                        </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Grading Criteria</CardTitle>
                            <CardDescription>Possible verdicts for your submission</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {Object.entries(test.gradingCriteria).map(([id, name]) => (
                                    <div key={id} className="flex items-center gap-2">
                                        <span className="font-medium">{name}</span>
                                        <span className="text-muted-foreground text-sm">
                                            (ID: {id})
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-4">
                    {submissionWarning && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{submissionWarning}</AlertDescription>
                        </Alert>
                    )}

                    {submission ? (
                        <Card>
                            <CardHeader>
                                <CardTitle>Your Submission</CardTitle>
                                <CardDescription>
                                    Submitted on {new Date(submission.created_at).toLocaleString()}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    You have already submitted this test. The status is: {submission.status}
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <CodeEditor testId={test.id} />
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
