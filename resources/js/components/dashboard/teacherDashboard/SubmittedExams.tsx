import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
    test: Test;
}

export const SubmittedExams = ({ test }: Props) => {
    const [expandedExam, setExpandedExam] = useState<boolean>(true);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'graded':
                return <Badge variant="default">Graded</Badge>;
            case 'pending':
                return <Badge variant="secondary">Pending</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const getSubmissionTypeBadge = (type: string) => {
        switch (type) {
            case 'editor':
                return <Badge variant="outline">Code Editor</Badge>;
            case 'file':
                return <Badge variant="outline">File Upload</Badge>;
            default:
                return null;
        }
    };

    return (
        <Card className="border-border">
            <CardHeader>
                <CardTitle className="text-foreground">{test.title}</CardTitle>
                <CardDescription className="text-muted-foreground">
                    View student submissions for this test
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <Card className="border-border overflow-hidden">
                        <Button
                            variant="ghost"
                            className="w-full h-auto p-4 flex justify-between items-center hover:bg-accent"
                            onClick={() => setExpandedExam(!expandedExam)}
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-foreground font-medium">Submissions</span>
                                <Badge variant="outline">
                                    {test.submissions.length} {test.submissions.length === 1 ? 'submission' : 'submissions'}
                                </Badge>
                            </div>
                            <span className="text-muted-foreground">
                                {expandedExam ? '−' : '+'}
                            </span>
                        </Button>
                        
                        {expandedExam && (
                            <CardContent className="p-4 pt-0">
                                {test.submissions.length === 0 ? (
                                    <p className="text-muted-foreground text-center py-4">
                                        No submissions yet
                                    </p>
                                ) : (
                                    <ul className="space-y-2">
                                        {test.submissions.map((submission) => (
                                            <li key={submission.id}>
                                                <Link href={route('teacher.submissions.show', { submission: submission.id })}>
                                                    <Button
                                                        variant="ghost"
                                                        className="w-full h-auto p-4 justify-between items-center hover:bg-accent"
                                                    >
                                                        <div className="flex flex-col items-start gap-1">
                                                            <div className="flex flex-col">
                                                                <span className="text-foreground font-medium text-lg">
                                                                    {submission.student.user.name}
                                                                </span>
                                                                <span className="text-sm text-muted-foreground">
                                                                    ID: {submission.student.id} • {submission.student.user.email}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                {getSubmissionTypeBadge(submission.submission_type)}
                                                                <span className="text-sm text-muted-foreground">
                                                                    Submitted: {new Date(submission.submission_date).toLocaleString()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {getStatusBadge(submission.status)}
                                                            {submission.grade && (
                                                                <span className="text-sm font-medium">
                                                                    Grade: {submission.grade}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </Button>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </CardContent>
                        )}
                    </Card>
                </div>
            </CardContent>
        </Card>
    );
};