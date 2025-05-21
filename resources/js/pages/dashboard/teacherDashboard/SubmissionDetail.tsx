import { useState } from 'react';
import { AppLayout } from '@/layouts/dashboard/teacherDashboard/teacherDashoboardLayout';
import { Head } from '@inertiajs/react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useForm } from '@inertiajs/react';

interface Grade {
    id: number;
    grade: number;
    feedback: string;
    status: string;
    created_at: string;
}

interface Submission {
    id: number;
    student: {
        id: number;
        user: {
            name: string;
        };
    };
    test: {
        id: number;
        title: string;
        problem_statement: string;
    };
    code_editor_text?: string;
    code_file_path?: string;
    submission_type: 'editor' | 'file';
    submission_date: string;
    status: 'pending' | 'graded';
    grades: Grade[];
}

interface Props {
    submission: Submission;
}

export default function SubmissionDetail({ submission }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        grade: submission.grades[0]?.grade || '',
        feedback: submission.grades[0]?.feedback || ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('teacher.submissions.grade', { submission: submission.id }));
    };

    return (
        <AppLayout>
            <Head title={`Submission - ${submission.test.title}`} />
            <div className="container mx-auto py-6 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Submission Details</CardTitle>
                        <CardDescription>
                            Student: {submission.student.user.name}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-medium mb-2">Problem Statement</h3>
                                <p className="text-muted-foreground whitespace-pre-wrap">
                                    {submission.test.problem_statement}
                                </p>
                            </div>

                            <div>
                                <h3 className="font-medium mb-2">Submission</h3>
                                {submission.submission_type === 'editor' ? (
                                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                                        <code>{submission.code_editor_text}</code>
                                    </pre>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline">File Submission</Badge>
                                        <a 
                                            href={`/storage/${submission.code_file_path}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline"
                                        >
                                            Download File
                                        </a>
                                    </div>
                                )}
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <Label htmlFor="grade">Grade</Label>
                                    <Input
                                        id="grade"
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={data.grade}
                                        onChange={e => setData('grade', e.target.value)}
                                        className="mt-1"
                                    />
                                    {errors.grade && (
                                        <p className="text-destructive text-sm mt-1">{errors.grade}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="feedback">Feedback</Label>
                                    <Textarea
                                        id="feedback"
                                        value={data.feedback}
                                        onChange={e => setData('feedback', e.target.value)}
                                        className="mt-1"
                                        rows={4}
                                    />
                                    {errors.feedback && (
                                        <p className="text-destructive text-sm mt-1">{errors.feedback}</p>
                                    )}
                                </div>

                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Grading...' : 'Submit Grade'}
                                </Button>
                            </form>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
} 