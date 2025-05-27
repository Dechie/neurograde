import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

interface Test {
    id: number;
    title: string;
    description: string;
}

interface AiMetrics {
    execution_time: number;
    memory_usage: number;
    code_quality: number;
}

interface Props {
    submissions: Submission[];
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
    test: Test;
    status: 'pending' | 'reviewed' | 'graded' | 'published' | 'ai_grading_failed';
    grades?: Grade[];
    code_editor_text?: string;
    code_file_path?: string;
    submission_date: string;
    ai_metrics?: AiMetrics;
    latest_ai_result?: {
        predicted_verdict_string: string;
        verdict_probabilities: { [key: string]: number };
        llm_review?: string;
    };
}

// ... rest of the imports and interfaces ...

export const StudentDashboard = ({ submissions }: Props) => {
    // ... existing state and handlers ...

    const getLatestGrade = (submission: Submission) => {
        if (!submission.grades || submission.grades.length === 0) return null;
        return submission.grades[0]; // Assuming grades are ordered by latest first
    };

    const renderSubmissionStatus = (submission: Submission) => {
        const latestGrade = getLatestGrade(submission);
        
        if (submission.status === 'published') {
            return (
                <div className="flex items-center gap-2">
                    <Badge variant="success">Published</Badge>
                    {latestGrade && (
                        <span className="text-sm font-medium">
                            Grade: {latestGrade.adjusted_grade}
                        </span>
                    )}
                </div>
            );
        }
        
        if (submission.status === 'graded') {
            return (
                <div className="flex items-center gap-2">
                    <Badge variant="default">Graded</Badge>
                    {latestGrade && (
                        <span className="text-sm font-medium">
                            Grade: {latestGrade.adjusted_grade}
                        </span>
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

    // ... rest of the component code ...

    return (
        <div className="space-y-6">
            <Card className="border-border">
                <CardHeader>
                    <CardTitle className="text-foreground">My Submissions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {submissions.map((submission) => (
                            <Card key={submission.id} className="border-border">
                                <CardHeader>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <CardTitle className="text-foreground">
                                                {submission.test.title}
                                            </CardTitle>
                                            <CardDescription>
                                                Submitted on {new Date(submission.submission_date).toLocaleString()}
                                            </CardDescription>
                                        </div>
                                        {renderSubmissionStatus(submission)}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {submission.code_editor_text && (
                                            <div className="space-y-2">
                                                <Label className="text-foreground">Code</Label>
                                                <pre className="p-4 bg-muted rounded-lg overflow-x-auto">
                                                    <code>{submission.code_editor_text}</code>
                                                </pre>
                                            </div>
                                        )}
                                        
                                        {submission.latest_ai_result && (
                                            <div className="space-y-2">
                                                <Label className="text-foreground">AI Review</Label>
                                                <div className="p-4 bg-muted rounded-lg">
                                                    <p className="text-sm">
                                                        {submission.latest_ai_result.llm_review || 'No AI review available'}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {getLatestGrade(submission) && (
                                            <div className="space-y-2">
                                                <Label className="text-foreground">Teacher Feedback</Label>
                                                <div className="p-4 bg-muted rounded-lg">
                                                    <p className="text-sm">
                                                        {getLatestGrade(submission)?.comments || 'No feedback available'}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}; 