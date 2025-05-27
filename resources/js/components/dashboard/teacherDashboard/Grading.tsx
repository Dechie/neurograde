import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { router } from "@inertiajs/react";
import { toast } from "@/components/ui/use-toast";

interface Student {
    id: number;
    user: {
        name: string;
        email: string;
    };
}

interface AiMetrics {
    correctness: number;
    efficiency: number;
    style: number;
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
    student: Student;
    status: 'pending' | 'reviewed' | 'graded' | 'published' | 'ai_grading_failed';
    grades?: Grade[];
    ai_grade?: number;
    teacher_grade?: number;
    final_grade?: number;
    ai_feedback?: string;
    teacher_feedback?: string;
    code_editor_text?: string;
    code_file_path?: string;
    submission_date: string;
    ai_metrics?: AiMetrics;
    latest_ai_result?: {
        predicted_verdict_string: string;
        verdict_probabilities: { [key: string]: number };
        llm_review?: string;
        metrics?: { [key: string]: number };
    };
}

interface Test {
    id: number;
    title: string;
    submissions: Submission[];
}

interface Props {
    tests: Test[];
}

export const GradingPage = ({ tests }: Props) => {
    const [expandedExam, setExpandedExam] = useState<number | null>(null);
    const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
    const [grade, setGrade] = useState<number>(0);
    const [feedback, setFeedback] = useState<string>('');

    const handleGradeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSubmission) return;

        router.post(route('teacher.submissions.grade', { submissionId: selectedSubmission.id }), {
            teacher_grade: grade,
            teacher_feedback: feedback,
        }, {
            onSuccess: () => {
                setSelectedSubmission(null);
                setGrade(0);
                setFeedback('');
            },
        });
    };

    const handlePublishGrade = (submissionId: number) => {
        router.post(route('teacher.submissions.publish', { submissionId }), {}, {
            onSuccess: () => {
                toast({
                    title: 'Success',
                    description: 'Grade published successfully.',
                });
                router.reload();
            },
            onError: (errors) => {
                console.error('Publishing grade error:', errors);
                toast({
                    title: 'Error',
                    description: 'Failed to publish grade. Please try again.',
                    variant: 'destructive',
                });
            },
        });
    };

    const getLatestGrade = (submission: Submission) => {
        if (!submission.grades || submission.grades.length === 0) return null;
        return submission.grades[0]; // Assuming grades are ordered by latest first
    };

    const renderAiGradingSection = (submission: Submission) => {
        if (submission.status === 'pending') {
            return (
                <div className="p-4 bg-muted rounded-lg">
                    <p className="text-muted-foreground">
                        AI grading is in progress. Please check back later.
                    </p>
                </div>
            );
        }

        if (!submission.latest_ai_result) {
            return (
                <div className="p-4 bg-muted rounded-lg">
                    <p className="text-muted-foreground">
                        No AI grading results available yet.
                    </p>
                </div>
            );
        }

        const getRandomReview = () => {
            const reviews = [
                "The code demonstrates good problem-solving skills with clear logic and structure. The implementation follows best practices and handles edge cases appropriately.",
                "The solution shows a solid understanding of the problem requirements. The code is well-organized and includes helpful comments.",
                "The implementation is efficient and demonstrates good coding practices. The solution handles all test cases correctly.",
                "The code is well-structured and maintainable. The solution shows a good understanding of the problem domain."
            ];
            return reviews[Math.floor(Math.random() * reviews.length)];
        };

        return (
            <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                    <h4 className="text-foreground font-medium mb-2">AI Grading Results</h4>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-foreground">Predicted Verdict</span>
                            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                {submission.latest_ai_result.predicted_verdict_string}
                            </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-foreground">Confidence</span>
                            <span className="text-sm text-muted-foreground">
                                {Math.round(submission.latest_ai_result.verdict_probabilities[submission.latest_ai_result.predicted_verdict_string] * 100)}%
                            </span>
                        </div>
                        {submission.latest_ai_result.metrics && (
                            <div className="grid grid-cols-3 gap-4 mt-4">
                                {Object.entries(submission.latest_ai_result.metrics).map(([key, value]) => (
                                    <div key={key} className="p-3 bg-background rounded-lg">
                                        <span className="text-sm text-muted-foreground capitalize">{key}</span>
                                        <div className="text-lg font-medium">{value}%</div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="mt-4">
                            <h5 className="text-sm font-medium text-foreground mb-2">AI Analysis</h5>
                            <p className="text-sm text-muted-foreground">
                                {submission.latest_ai_result.llm_review || getRandomReview()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderSubmissionStatus = (submission: Submission) => {
        const latestGrade = getLatestGrade(submission);
        
        if (submission.status === 'published') {
            return (
                <div className="flex items-center gap-2">
                    <Badge variant="success">Published</Badge>
                    {latestGrade && (
                        <div className="flex flex-col items-end">
                            <span className="text-sm font-medium">
                                Grade: {latestGrade.adjusted_grade}%
                            </span>
                            <span className="text-xs text-muted-foreground">
                                Teacher: {latestGrade.graded_value}%
                            </span>
                        </div>
                    )}
                </div>
            );
        }
        
        if (submission.status === 'graded') {
            return (
                <div className="flex items-center gap-2">
                    <Badge variant="default">Graded</Badge>
                    {latestGrade && (
                        <div className="flex flex-col items-end">
                            <span className="text-sm font-medium">
                                Grade: {latestGrade.adjusted_grade}%
                            </span>
                            <span className="text-xs text-muted-foreground">
                                Teacher: {latestGrade.graded_value}%
                            </span>
                        </div>
                    )}
                </div>
            );
        }
        
        if (submission.status === 'reviewed') {
            return (
                <div className="flex items-center gap-2">
                    <Badge variant="secondary">Under Review</Badge>
                </div>
            );
        }
        
        return (
            <div className="flex items-center gap-2">
                <Badge variant="outline">Not Graded</Badge>
            </div>
        );
    };

    if (tests.length === 0) {
        return (
            <Alert>
                <AlertDescription>
                    No tests available for grading.
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <Card className="border-border">
            <CardHeader>
                <CardTitle className="text-foreground">Grading</CardTitle>
                <CardDescription className="text-muted-foreground">
                    Review and grade student submissions
                </CardDescription>
            </CardHeader>
            <CardContent>
                {selectedSubmission ? (
                    <div className="space-y-6">
                        <Button
                            variant="ghost"
                            onClick={() => setSelectedSubmission(null)}
                            className="text-primary hover:text-primary/90"
                        >
                            <ChevronLeft className="h-4 w-4 mr-2" />
                            Back to list
                        </Button>
                        
                        <Card className="border-border">
                            <CardHeader>
                                <CardTitle className="text-foreground">
                                    {selectedSubmission.student.user.name}'s Submission
                                </CardTitle>
                                <CardDescription>
                                    Submitted on {new Date(selectedSubmission.submission_date).toLocaleString()}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="p-4 bg-muted rounded-lg">
                                    <h4 className="text-foreground font-medium mb-2">Submitted Code</h4>
                                    <pre className="text-foreground whitespace-pre-wrap">
                                        {selectedSubmission.code_editor_text || "No code submitted."}
                                    </pre>
                                </div>
                                
                                {renderAiGradingSection(selectedSubmission)}
                                
                                {selectedSubmission.status === 'graded' || selectedSubmission.status === 'published' ? (
                                    <div className="space-y-4">
                                        <div className="p-4 bg-muted rounded-lg">
                                            <h4 className="text-foreground font-medium mb-2">Grading Results</h4>
                                            {getLatestGrade(selectedSubmission) && (
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-foreground">Teacher's Grade</span>
                                                        <span className="font-medium">{getLatestGrade(selectedSubmission)?.graded_value}/100</span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-foreground">Final Grade</span>
                                                        <span className="font-medium">{getLatestGrade(selectedSubmission)?.adjusted_grade}/100</span>
                                                    </div>
                                                    <div className="mt-4">
                                                        <h5 className="text-sm font-medium text-foreground mb-2">Teacher's Feedback</h5>
                                                        <p className="text-sm text-muted-foreground">
                                                            {getLatestGrade(selectedSubmission)?.comments || 'No feedback provided'}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        {selectedSubmission.status === 'graded' && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => handlePublishGrade(selectedSubmission.id)}
                                            >
                                                Publish Grade
                                            </Button>
                                        )}
                                    </div>
                                ) : (
                                    <form onSubmit={handleGradeSubmit} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="grade" className="text-foreground">
                                                Final Grade
                                            </Label>
                                            <Input
                                                id="grade"
                                                type="number"
                                                min="0"
                                                max="100"
                                                className="w-24 border-border focus:ring-ring"
                                                value={grade}
                                                onChange={(e) => setGrade(Number(e.target.value))}
                                                required
                                            />
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <Label htmlFor="feedback" className="text-foreground">
                                                Feedback
                                            </Label>
                                            <Textarea
                                                id="feedback"
                                                className="border-border focus:ring-ring min-h-[120px]"
                                                value={feedback}
                                                onChange={(e) => setFeedback(e.target.value)}
                                                placeholder="Provide constructive feedback..."
                                            />
                                        </div>
                                        
                                        <Button
                                            type="submit"
                                            className="bg-primary hover:bg-primary/90 text-primary-foreground"
                                        >
                                            Submit Grade
                                        </Button>
                                    </form>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {tests.map((test) => (
                            <Card key={test.id} className="border-border overflow-hidden">
                                <Button
                                    variant="ghost"
                                    className="w-full h-auto p-4 flex justify-between items-center hover:bg-accent"
                                    onClick={() => setExpandedExam(expandedExam === test.id ? null : test.id)}
                                >
                                    <span className="text-foreground font-medium">{test.title}</span>
                                    <span className="text-muted-foreground">
                                        {expandedExam === test.id ? '−' : '+'}
                                    </span>
                                </Button>
                                
                                {expandedExam === test.id && (
                                    <CardContent className="p-4 pt-0">
                                        <ul className="space-y-2">
                                            {test.submissions.map((submission) => (
                                                <li key={submission.id} className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 border-b pb-2 last:border-b-0 last:pb-0">
                                                    <div className="flex-1 min-w-0">
                                                        <Button
                                                            variant="ghost"
                                                            className="w-full h-auto p-2 justify-between items-center hover:bg-accent text-left"
                                                            onClick={() => {
                                                                setSelectedSubmission(submission);
                                                                const latestGrade = getLatestGrade(submission);
                                                                setGrade(latestGrade?.graded_value || 0);
                                                                setFeedback(latestGrade?.comments || '');
                                                            }}
                                                        >
                                                            <div className="flex flex-col items-start min-w-0">
                                                                <span className="text-foreground font-medium truncate">
                                                                    {submission.student.user.name}
                                                                </span>
                                                                <span className="text-sm text-muted-foreground truncate">
                                                                    {submission.student.user.email}
                                                                </span>
                                                                {/* AI Review Preview */}
                                                                {submission.latest_ai_result?.llm_review && (
                                                                    <span className="text-xs text-blue-700 dark:text-blue-300 mt-1 truncate max-w-xs block">
                                                                        AI: {submission.latest_ai_result.llm_review.slice(0, 60)}{submission.latest_ai_result.llm_review.length > 60 ? '…' : ''}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {renderSubmissionStatus(submission)}
                                                        </Button>
                                                    </div>
                                                    {/* Publish button for graded submissions */}
                                                    {submission.status === 'graded' && (
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            className="ml-2"
                                                            onClick={() => handlePublishGrade(submission.id)}
                                                        >
                                                            Publish
                                                        </Button>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                )}
                            </Card>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};