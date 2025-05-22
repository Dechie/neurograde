import { AppLayout } from "@/layouts/dashboard/studentDashboard/studentDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

interface Submission {
    id: number;
    test: {
        id: number;
        title: string;
    };
    status: string;
    grade: number | null;
    feedback: string | null;
    code_editor_text: string;
    submission_date: string;
}

interface SubmissionShowProps {
    submission: Submission;
}

export default function SubmissionShow({ submission }: SubmissionShowProps) {
    return (
        <AppLayout title={`Submission - ${submission.test.title}`}>
            <div className="space-y-6">
                {/* Submission Details */}
                <Card>
                    <CardHeader>
                        <CardTitle>Submission Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label>Status</Label>
                            <Badge variant={submission.status === 'graded' ? "success" : "secondary"}>
                                {submission.status}
                            </Badge>
                        </div>
                        <div>
                            <Label>Grade</Label>
                            <p>{submission.grade ? `${submission.grade}%` : 'Not graded'}</p>
                        </div>
                        <div>
                            <Label>Feedback</Label>
                            <p>{submission.feedback || 'No feedback provided.'}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Student's Submission */}
                <Card>
                    <CardHeader>
                        <CardTitle>Your Submission</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                            {submission.code_editor_text}
                        </pre>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
} 