import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { AppLayout } from '@/layouts/dashboard/teacherDashboard/teacherDashboardLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';

interface AiGradingResult {
    predicted_id: number;
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
    graded_value: number;
    adjusted_grade: number;
    comments: string;
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
    latest_ai_result?: AiGradingResult;
}

interface Props {
    submission: Submission;
}

export default function SubmissionDetail({ submission }: Props) {
    const { toast } = useToast();
    const { data, setData, post, processing, errors, reset } = useForm({
        teacher_grade: submission.grades?.[0]?.graded_value?.toString() || '',
        teacher_feedback: submission.grades?.[0]?.comments || '',
    });

    const [feedbackLength, setFeedbackLength] = useState(0);
    const MAX_FEEDBACK_LENGTH = 1000;

    useEffect(() => {
        setFeedbackLength(data.teacher_feedback.length);
    }, [data.teacher_feedback]);

    const validateGrade = (grade: string): { isValid: boolean; error?: string } => {
        if (!grade) {
            return { isValid: false, error: 'Grade is required' };
        }

        const numericGrade = parseFloat(grade);
        if (isNaN(numericGrade)) {
            return { isValid: false, error: 'Grade must be a valid number' };
        }

        if (numericGrade < 0 || numericGrade > 100) {
            return { isValid: false, error: 'Grade must be between 0 and 100' };
        }

        if (numericGrade % 0.5 !== 0) {
            return { isValid: false, error: 'Grade must be a multiple of 0.5 (e.g., 85.0, 85.5, 86.0)' };
        }

        return { isValid: true };
    };

    const validateFeedback = (feedback: string): { isValid: boolean; error?: string } => {
        if (!feedback.trim()) {
            return { isValid: false, error: 'Feedback is required' };
        }
        if (feedback.length > MAX_FEEDBACK_LENGTH) {
            return { isValid: false, error: `Feedback must be less than ${MAX_FEEDBACK_LENGTH} characters` };
        }
        return { isValid: true };
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const gradeValidation = validateGrade(data.teacher_grade);
        const feedbackValidation = validateFeedback(data.teacher_feedback);

        if (!gradeValidation.isValid) {
            toast({
                title: 'Invalid Grade',
                description: gradeValidation.error,
                variant: 'destructive',
            });
            return;
        }

        if (!feedbackValidation.isValid) {
            toast({
                title: 'Invalid Feedback',
                description: feedbackValidation.error,
                variant: 'destructive',
            });
            return;
        }

        post(route('teacher.submissions.grade', { submissionId: submission.id }), {
            onSuccess: () => {
                toast({
                    title: 'Success',
                    description: 'Grade submitted successfully.',
                });
                router.reload();
            },
            onError: (errors) => {
                console.error('Grading submission error:', errors);
                toast({
                    title: 'Error',
                    description: errors?.message || 'Failed to submit grade. Please try again.',
                    variant: 'destructive',
                });
            },
            preserveScroll: true,
        });
    };

    const getVerdictColor = (verdict: string) => {
        const colors: { [key: string]: string } = {
            Accepted: 'bg-green-100 text-green-800',
            'Wrong Answer': 'bg-red-100 text-red-800',
            'Time Limit Exceeded': 'bg-yellow-100 text-yellow-800',
            'Memory Limit Exceeded': 'bg-orange-100 text-orange-800',
            'Runtime Error': 'bg-red-100 text-red-800',
            'Compile Error': 'bg-red-100 text-red-800',
            'Presentation Error': 'bg-blue-100 text-blue-800',
        };
        return colors[verdict] || 'bg-gray-100 text-gray-800';
    };

    return (
        <AppLayout>
            <Head title={`Submission - ${submission.test.title}`} />
            <div className="container mx-auto space-y-6 py-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Submission Details</CardTitle>
                        <CardDescription>Student: {submission.student.user.name}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {/* Submission */}
                            <div>
                                <h3 className="mb-2 font-medium">Submission</h3>
                                {submission.submission_type === 'editor' ? (
                                    <pre className="bg-muted overflow-x-auto rounded-lg p-4">
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
                                    <h3 className="mb-2 font-medium">AI Grading Results</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <Badge className={getVerdictColor(submission.latest_ai_result.predicted_verdict_string)}>
                                                {submission.latest_ai_result.predicted_verdict_string}
                                            </Badge>
                                            <span className="text-muted-foreground text-sm">
                                                Confidence:{' '}
                                                {Math.round(
                                                    submission.latest_ai_result.verdict_probabilities[
                                                        submission.latest_ai_result.predicted_verdict_string
                                                    ] * 100,
                                                )}
                                                %
                                            </span>
                                        </div>

                                        {/* LLM Review */}
                                        <div className="bg-muted/50 rounded-lg p-4">
                                            <h4 className="mb-2 text-sm font-medium">AI Analysis:</h4>
                                            <p className="text-muted-foreground text-sm whitespace-pre-wrap">
                                                {submission.latest_ai_result.llm_review || "The code demonstrates good problem-solving skills with clear logic and structure. The implementation follows best practices and handles edge cases appropriately."}
                                            </p>
                                        </div>

                                        {/* Additional Metrics */}
                                        {submission.latest_ai_result.metrics && (
                                            <div>
                                                <h4 className="mb-2 text-sm font-medium">Additional Metrics:</h4>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {Object.entries(submission.latest_ai_result.metrics).map(([key, value]) => (
                                                        <div key={key} className="flex items-center justify-between text-sm">
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
                            {submission.status !== 'published' && (
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
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                const validation = validateGrade(value);
                                                if (validation.isValid || value === '') {
                                                    setData('teacher_grade', value);
                                                }
                                            }}
                                            onBlur={(e) => {
                                                const value = e.target.value;
                                                if (value && !validateGrade(value).isValid) {
                                                    toast({
                                                        title: 'Invalid Grade',
                                                        description: validateGrade(value).error,
                                                        variant: 'destructive',
                                                    });
                                                }
                                            }}
                                            className="mt-1"
                                            required
                                            placeholder="Enter grade (e.g., 85.0, 85.5)"
                                        />
                                        {errors.teacher_grade && <p className="text-destructive mt-1 text-sm">{errors.teacher_grade}</p>}
                                        <p className="text-muted-foreground mt-1 text-sm">
                                            Grade must be a multiple of 0.5 between 0 and 100
                                        </p>
                                    </div>

                                    <div>
                                        <Label htmlFor="teacher_feedback">Feedback</Label>
                                        <Textarea
                                            id="teacher_feedback"
                                            value={data.teacher_feedback}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (value.length <= MAX_FEEDBACK_LENGTH) {
                                                    setData('teacher_feedback', value);
                                                }
                                            }}
                                            className="mt-1"
                                            rows={4}
                                            required
                                            placeholder="Provide constructive feedback..."
                                        />
                                        <div className="flex justify-between mt-1">
                                            {errors.teacher_feedback && (
                                                <p className="text-destructive text-sm">{errors.teacher_feedback}</p>
                                            )}
                                            <p className={`text-sm ${feedbackLength > MAX_FEEDBACK_LENGTH ? 'text-destructive' : 'text-muted-foreground'}`}>
                                                {feedbackLength}/{MAX_FEEDBACK_LENGTH} characters
                                            </p>
                                        </div>
                                    </div>

                                    <Button 
                                        type="submit" 
                                        disabled={processing || feedbackLength > MAX_FEEDBACK_LENGTH} 
                                        className="w-full"
                                    >
                                        {processing ? (
                                            <div className="flex items-center gap-2">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                Submitting Grade...
                                            </div>
                                        ) : (
                                            'Submit Grade'
                                        )}
                                    </Button>
                                </form>
                            )}

                            {/* Display Current Grade if Published */}
                            {submission.status === 'published' && submission.grades && submission.grades.length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="font-medium">Current Grade</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-muted rounded-lg">
                                            <h4 className="text-sm font-medium mb-2">Teacher's Grade</h4>
                                            <p className="text-2xl font-bold">{submission.grades[0].graded_value}%</p>
                                        </div>
                                        <div className="p-4 bg-muted rounded-lg">
                                            <h4 className="text-sm font-medium mb-2">Final Grade</h4>
                                            <p className="text-2xl font-bold">{submission.grades[0].adjusted_grade}%</p>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-muted rounded-lg">
                                        <h4 className="text-sm font-medium mb-2">Teacher's Feedback</h4>
                                        <p className="text-sm text-muted-foreground">
                                            {submission.grades[0].comments}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
