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

interface Submission {
    id: number;
    student: Student;
    status: 'pending' | 'reviewed' | 'graded' | 'published' | 'ai_grading_failed';
    ai_grade?: number;
    teacher_grade?: number;
    final_grade?: number;
    ai_feedback?: string;
    teacher_feedback?: string;
    code_editor_text?: string;
    code_file_path?: string;
    submission_date: string;
    ai_metrics?: AiMetrics;
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
        router.post(route('teacher.submissions.publish', { submissionId }));
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

        if (!submission.ai_grade && !submission.ai_metrics) {
            return (
                <div className="p-4 bg-muted rounded-lg">
                    <p className="text-muted-foreground">
                        No AI grading results available yet.
                    </p>
                </div>
            );
        }

        return (
            <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                    <h4 className="text-foreground font-medium mb-2">AI Grading Results</h4>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-foreground">Overall Score</span>
                            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                {submission.ai_grade}/100
                            </Badge>
                        </div>
                        {submission.ai_metrics && (
                            <div className="grid grid-cols-3 gap-4 mt-4">
                                <div className="p-3 bg-background rounded-lg">
                                    <span className="text-sm text-muted-foreground">Correctness</span>
                                    <div className="text-lg font-medium">{submission.ai_metrics.correctness}%</div>
                                </div>
                                <div className="p-3 bg-background rounded-lg">
                                    <span className="text-sm text-muted-foreground">Efficiency</span>
                                    <div className="text-lg font-medium">{submission.ai_metrics.efficiency}%</div>
                                </div>
                                <div className="p-3 bg-background rounded-lg">
                                    <span className="text-sm text-muted-foreground">Style</span>
                                    <div className="text-lg font-medium">{submission.ai_metrics.style}%</div>
                                </div>
                            </div>
                        )}
                        {submission.ai_feedback && (
                            <div className="mt-4">
                                <h5 className="text-sm font-medium text-foreground mb-2">AI Feedback</h5>
                                <p className="text-sm text-muted-foreground">
                                    {submission.ai_feedback}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
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
                                    
                                    <div className="flex gap-2">
                                        <Button
                                            type="submit"
                                            className="bg-primary hover:bg-primary/90 text-primary-foreground"
                                        >
                                            Submit Grade
                                        </Button>
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
                                </form>
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
                                                <li key={submission.id}>
                                                    <Button
                                                        variant="ghost"
                                                        className="w-full h-auto p-2 justify-between items-center hover:bg-accent"
                                                        onClick={() => {
                                                            setSelectedSubmission(submission);
                                                            setGrade(submission.teacher_grade || submission.ai_grade || 0);
                                                            setFeedback(submission.teacher_feedback || '');
                                                        }}
                                                    >
                                                        <div className="flex flex-col items-start">
                                                            <span className="text-foreground font-medium">
                                                                {submission.student.user.name}
                                                            </span>
                                                            <span className="text-sm text-muted-foreground">
                                                                {submission.student.user.email}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Badge variant={
                                                                submission.status === 'published' ? 'success' :
                                                                submission.status === 'graded' ? 'default' :
                                                                submission.status === 'reviewed' ? 'secondary' :
                                                                'outline'
                                                            }>
                                                                {submission.status}
                                                            </Badge>
                                                            {submission.final_grade && (
                                                                <span className="text-sm font-medium">
                                                                    Grade: {submission.final_grade}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </Button>
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