import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { AppLayout } from "@/layouts/dashboard/studentDashboard/studentDashboardLayout"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface TestResult {
    id: number;
    test: {
        id: number;
        title: string;
    };
    score: number;
    comment: string;
    metrics: {
        correctness: number;
        efficiency: number;
        style: number;
    };
    submission_date: string;
    status: 'pending' | 'reviewed' | 'graded' | 'published';
}

interface Props {
    results: TestResult[];
}

export default function Results({ results }: Props) {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'published':
                return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Published</Badge>;
            case 'graded':
                return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Graded</Badge>;
            case 'reviewed':
                return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">AI Reviewed</Badge>;
            case 'pending':
                return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">Pending</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    if (!results || results.length === 0) {
        return (
            <AppLayout title="Results">
                <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        No test results available yet.
                    </AlertDescription>
                </Alert>
            </AppLayout>
        );
    }

    return (
        <AppLayout title="Results">
            <div className="space-y-6 w-full max-w-full">
                <Card className="w-full max-w-full">
                    <CardHeader>
                        <CardTitle>Test Results</CardTitle>
                        <CardDescription>
                            View your test results and feedback
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {results.map((result) => (
                                <Card key={result.id} className="border-border">
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-lg font-medium text-foreground">
                                                    {result.test.title}
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    Submitted on {new Date(result.submission_date).toLocaleString()}
                                                </p>
                                            </div>
                                            {getStatusBadge(result.status)}
                                        </div>

                                        {result.status === 'published' && (
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-3 gap-4">
                                                    <div className="p-3 bg-muted rounded-lg">
                                                        <span className="text-sm text-muted-foreground">Overall Score</span>
                                                        <div className="text-lg font-medium">{result.score}/100</div>
                                                    </div>
                                                    {result.metrics && (
                                                        <>
                                                            <div className="p-3 bg-muted rounded-lg">
                                                                <span className="text-sm text-muted-foreground">Correctness</span>
                                                                <div className="text-lg font-medium">{result.metrics.correctness}%</div>
                                                            </div>
                                                            <div className="p-3 bg-muted rounded-lg">
                                                                <span className="text-sm text-muted-foreground">Efficiency</span>
                                                                <div className="text-lg font-medium">{result.metrics.efficiency}%</div>
                                                            </div>
                                                            <div className="p-3 bg-muted rounded-lg">
                                                                <span className="text-sm text-muted-foreground">Style</span>
                                                                <div className="text-lg font-medium">{result.metrics.style}%</div>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>

                                                {result.comment && (
                                                    <div className="mt-4">
                                                        <h4 className="text-sm font-medium text-foreground mb-2">Feedback</h4>
                                                        <p className="text-sm text-muted-foreground">
                                                            {result.comment}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {result.status === 'pending' && (
                                            <div className="p-4 bg-muted rounded-lg">
                                                <p className="text-muted-foreground">
                                                    Your submission is being processed. Please check back later.
                                                </p>
                                            </div>
                                        )}

                                        {result.status === 'reviewed' && (
                                            <div className="p-4 bg-muted rounded-lg">
                                                <p className="text-muted-foreground">
                                                    Your submission has been reviewed by AI. Waiting for teacher's final grade.
                                                </p>
                                            </div>
                                        )}

                                        {result.status === 'graded' && (
                                            <div className="p-4 bg-muted rounded-lg">
                                                <p className="text-muted-foreground">
                                                    Your submission has been graded. Waiting for the grade to be published.
                                                </p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
