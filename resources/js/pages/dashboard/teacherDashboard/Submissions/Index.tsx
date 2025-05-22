import { AppLayout } from "@/layouts/dashboard/teacherDashboard/teacherDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";

interface Submission {
    id: number;
    student: {
        id: number;
        user: {
            name: string;
            email: string;
        };
    };
    test: {
        id: number;
        title: string;
    };
    status: string;
    grade: number | null;
    feedback: string | null;
    code_editor_text: string;
    submission_date: string;
    ml_verdict_string?: string;
    ml_verdict_probabilities?: Record<string, number>;
}

interface SubmissionsPageProps {
    submissions: Submission[];
}

export default function SubmissionsIndex({ submissions }: SubmissionsPageProps) {
    return (
        <AppLayout title="Submissions">
            <div className="space-y-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>All Submissions</CardTitle>
                            <CardDescription>View and manage test submissions</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Student</TableHead>
                                    <TableHead>Test</TableHead>
                                    <TableHead>Submission Date</TableHead>
                                    <TableHead>ML Verdict</TableHead>
                                    <TableHead>ML Confidence</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Final Grade</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {submissions.map((submission) => (
                                    <TableRow key={submission.id}>
                                        <TableCell>
                                            {submission.student.user.name}
                                        </TableCell>
                                        <TableCell>
                                            {submission.test.title}
                                        </TableCell>
                                        <TableCell>{new Date(submission.submission_date).toLocaleString()}</TableCell>
                                        <TableCell>
                                            {submission.ml_verdict_string || 'Not graded'}
                                        </TableCell>
                                        <TableCell>
                                            {submission.ml_verdict_probabilities ? 
                                                `${Math.round(Math.max(...Object.values(submission.ml_verdict_probabilities)) * 100)}%` : 
                                                'N/A'}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={submission.status === 'graded' ? "default" : "secondary"}>
                                                {submission.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{submission.grade || 'Not graded'}</TableCell>
                                        <TableCell>
                                            <Link href={route('teacher.submissions.show', submission.id)}>
                                                <Button variant="outline" size="sm">
                                                    View Details
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
} 