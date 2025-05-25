import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useForm } from '@inertiajs/react';
import { AppLayout } from '@/layouts/dashboard/teacherDashboard/teacherDashboardLayout';
import { useToast } from "@/components/ui/use-toast";

interface AiGradingResult {
    predicted_verdict_id: number;
    predicted_verdict_string: string;
    verdict_probabilities: {
        [key: string]: number;
    };
    metrics?: {
        [key: string]: any;
    };
    llm_review?: string;
}

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
    status: 'pending' | 'graded' | 'published';
    grades?: Grade[];
    ai_grade?: number;
    teacher_grade?: number;
    final_grade?: number;
    ai_feedback?: string;
    teacher_feedback?: string;
    ai_metrics?: any;
    latest_ai_result?: AiGradingResult;
}

interface Props {
    submission: Submission;
}

export default function SubmissionDetail({ submission }: Props) {
    const { toast } = useToast();
    const { data, setData, post, processing, errors, reset } = useForm({
        teacher_grade: submission.teacher_grade?.toString() || '',
        teacher_feedback: submission.teacher_feedback || ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate form data
        if (!data.teacher_grade || !data.teacher_feedback) {
            toast({
                title: "Validation Error",
                description: "Please provide both a grade and feedback.",
                variant: "destructive",
            });
            return;
        }

        // Ensure grade is a valid number between 0 and 100 and is a multiple of 0.5
        const grade = parseFloat(data.teacher_grade);
        if (isNaN(grade) || grade < 0 || grade > 100) {
            toast({
                title: "Invalid Grade",
                description: "Grade must be a number between 0 and 100.",
                variant: "destructive",
            });
            return;
        }

        // Check if grade is a multiple of 0.5
        if (grade % 0.5 !== 0) {
            toast({
                title: "Invalid Grade",
                description: "Grade must be a multiple of 0.5 (e.g., 85.0, 85.5, 86.0).",
                variant: "destructive",
            });
            return;
        }

        post(route('teacher.submissions.grade', { submissionId: submission.id }), {
            onSuccess: () => {
                toast({
                    title: "Success",
                    description: "Grade submitted successfully.",
                });
                // Optionally refresh the page to show updated data
                router.reload();
            },
            onError: (errors) => {
                console.error('Grading submission error:', errors);
                toast({
                    title: "Error",
                    description: "Failed to submit grade. Please try again.",
                    variant: "destructive",
                });
            },
            preserveScroll: true,
        });
    };

    const getVerdictColor = (verdict: string) => {
        const colors: { [key: string]: string } = {
            'Accepted': 'bg-green-100 text-green-800',
            'Wrong Answer': 'bg-red-100 text-red-800',
            'Time Limit Exceeded': 'bg-yellow-100 text-yellow-800',
            'Memory Limit Exceeded': 'bg-orange-100 text-orange-800',
            'Runtime Error': 'bg-red-100 text-red-800',
            'Compile Error': 'bg-red-100 text-red-800',
            'Presentation Error': 'bg-blue-100 text-blue-800'
        };
        return colors[verdict] || 'bg-gray-100 text-gray-800';
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
                        <div className="space-y-6">
                            {/* Submission */}
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

                            {/* AI Grading Results */}
                            {submission.latest_ai_result && (
                                <div>
                                    <h3 className="font-medium mb-2">AI Grading Results</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <Badge className={getVerdictColor(submission.latest_ai_result.predicted_verdict_string)}>
                                                {submission.latest_ai_result.predicted_verdict_string}
                                            </Badge>
                                            <span className="text-sm text-muted-foreground">
                                                Confidence: {Math.round(submission.latest_ai_result.verdict_probabilities[submission.latest_ai_result.predicted_verdict_string] * 100)}%
                                            </span>
                                        </div>

                                        {/* LLM Review */}
                                        {submission.latest_ai_result.llm_review && (
                                            <div className="bg-muted/50 p-4 rounded-lg">
                                                <h4 className="text-sm font-medium mb-2">AI Analysis:</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    {submission.latest_ai_result.llm_review}
                                                </p>
                                            </div>
                                        )}

                                        {/* Verdict Probabilities */}
                                        <div>
                                            <h4 className="text-sm font-medium mb-2">Verdict Probabilities:</h4>
                                            <div className="grid grid-cols-2 gap-2">
                                                {Object.entries(submission.latest_ai_result.verdict_probabilities)
                                                    .sort(([,a], [,b]) => b - a)
                                                    .map(([verdict, probability]) => (
                                                        <div key={verdict} className="flex justify-between items-center text-sm">
                                                            <span>{verdict}:</span>
                                                            <span>{Math.round(probability * 100)}%</span>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>

                                        {/* Additional Metrics */}
                                        {submission.latest_ai_result.metrics && (
                                            <div>
                                                <h4 className="text-sm font-medium mb-2">Additional Metrics:</h4>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {Object.entries(submission.latest_ai_result.metrics).map(([key, value]) => (
                                                        <div key={key} className="flex justify-between items-center text-sm">
                                                            <span>{key}:</span>
                                                            <span>{value}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Teacher Grading Form */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <Label htmlFor="teacher_grade">Grade</Label>
                                    <Input
                                        id="teacher_grade"
                                        type="number"
                                        min="0"
                                        max="100"
                                        step="0.5"
                                        value={data.teacher_grade}
                                        onChange={e => {
                                            const value = e.target.value;
                                            // Only allow multiples of 0.5
                                            if (value === '' || (parseFloat(value) % 0.5 === 0 && parseFloat(value) >= 0 && parseFloat(value) <= 100)) {
                                                setData('teacher_grade', value);
                                            }
                                        }}
                                        className="mt-1"
                                        required
                                        placeholder="Enter grade (e.g., 85.0, 85.5)"
                                    />
                                    {errors.teacher_grade && (
                                        <p className="text-destructive text-sm mt-1">{errors.teacher_grade}</p>
                                    )}
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Grade must be a multiple of 0.5 (e.g., 85.0, 85.5, 86.0)
                                    </p>
                                </div>

                                <div>
                                    <Label htmlFor="teacher_feedback">Feedback</Label>
                                    <Textarea
                                        id="teacher_feedback"
                                        value={data.teacher_feedback}
                                        onChange={e => setData('teacher_feedback', e.target.value)}
                                        className="mt-1"
                                        rows={4}
                                        required
                                    />
                                    {errors.teacher_feedback && (
                                        <p className="text-destructive text-sm mt-1">{errors.teacher_feedback}</p>
                                    )}
                                </div>

                                <Button 
                                    type="submit" 
                                    disabled={processing}
                                    className="w-full"
                                >
                                    {processing ? 'Submitting Grade...' : 'Submit Grade'}
                                </Button>
                            </form>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
} 