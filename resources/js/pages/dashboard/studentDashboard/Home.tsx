import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AppLayout } from '@/layouts/dashboard/studentDashboard/studentDashboardLayout';
import { AlertCircle } from 'lucide-react';

interface Test {
    id: number;
    title: string;
    due_date: string;
    class_name: string;
    department: string;
    has_submitted?: boolean;
}

interface Result {
    id: number;
    test: Test;
    status: 'pending' | 'reviewed' | 'graded' | 'published';
    score: number;
    comment?: string;
    submission_date: string;
    metrics?: {
        correctness: number;
        efficiency: number;
        style: number;
    };
    ai_review?: string;
}

interface Statistics {
    total_tests: number;
    completed_tests: number;
    pending_submissions: number;
    average_score: number;
}

interface User {
    name: string;
    student: {
        id_number: string;
    };
}

interface HomeProps {
    user: User;
    upcomingTests: Test[];
    recentResults: Result[];
    statistics: Statistics;
}

export default function Home({ user, upcomingTests, recentResults, statistics }: HomeProps) {
    return (
        <AppLayout title="Dashboard">
            <div className="space-y-6">
                {/* Welcome Section */}
                <div>
                    <h1 className="text-3xl font-bold">Welcome, {user.name}!</h1>
                    <p className="text-muted-foreground">Student ID: {user.student.id_number}</p>
                </div>

                {/* Statistics Overview */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <h3 className="text-2xl font-bold">{statistics.total_tests}</h3>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Completed Tests</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <h3 className="text-2xl font-bold">{statistics.completed_tests}</h3>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Submissions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <h3 className="text-2xl font-bold">{statistics.pending_submissions}</h3>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <h3 className="text-2xl font-bold">{statistics.average_score}%</h3>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Results */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Results</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {recentResults.length > 0 ? (
                            <div className="space-y-4">
                                {recentResults.map((result) => (
                                    <Dialog key={result.id}>
                                        <DialogTrigger asChild>
                                            <div className="hover:bg-muted/50 flex cursor-pointer items-center justify-between rounded-lg p-2 transition-colors">
                                                <div>
                                                    <h3 className="font-medium">{result.test.title}</h3>
                                                    <p className="text-muted-foreground text-sm">
                                                        Submitted {new Date(result.submission_date).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <div className="flex items-center gap-2">
                                                        {result.status === 'published' ? (
                                                            <>
                                                                <p className="font-medium">{result.score}%</p>
                                                                <Badge variant="success">Published</Badge>
                                                            </>
                                                        ) : result.status === 'graded' ? (
                                                            <>
                                                                <p className="font-medium">{result.score}%</p>
                                                                <Badge variant="default">Graded</Badge>
                                                            </>
                                                        ) : result.status === 'reviewed' ? (
                                                            <>
                                                                <p className="font-medium">Pending</p>
                                                                <Badge variant="secondary">Under Review</Badge>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <p className="font-medium">Pending</p>
                                                                <Badge variant="outline">Not Graded</Badge>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-2xl">
                                            <DialogHeader>
                                                <DialogTitle>{result.test.title}</DialogTitle>
                                            </DialogHeader>
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-muted-foreground text-sm">
                                                        Submitted on {new Date(result.submission_date).toLocaleString()}
                                                    </span>
                                                    {result.status === 'published' && <Badge variant="success">Published</Badge>}
                                                </div>

                                                {result.status === 'published' && (
                                                    <>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="bg-muted rounded-lg p-4">
                                                                <h4 className="mb-2 text-sm font-medium">Final Grade</h4>
                                                                <p className="text-2xl font-bold">{result.score}%</p>
                                                            </div>
                                                            {result.metrics && (
                                                                <>
                                                                    <div className="bg-muted rounded-lg p-4">
                                                                        <h4 className="mb-2 text-sm font-medium">Correctness</h4>
                                                                        <p className="text-2xl font-bold">{result.metrics.correctness}%</p>
                                                                    </div>
                                                                    <div className="bg-muted rounded-lg p-4">
                                                                        <h4 className="mb-2 text-sm font-medium">Efficiency</h4>
                                                                        <p className="text-2xl font-bold">{result.metrics.efficiency}%</p>
                                                                    </div>
                                                                    <div className="bg-muted rounded-lg p-4">
                                                                        <h4 className="mb-2 text-sm font-medium">Style</h4>
                                                                        <p className="text-2xl font-bold">{result.metrics.style}%</p>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>

                                                        <div className="space-y-4">
                                                            <div>
                                                                <h4 className="mb-2 text-sm font-medium">AI Analysis</h4>
                                                                <div className="bg-muted rounded-lg p-4">
                                                                    <p className="text-muted-foreground text-sm">
                                                                        {result.ai_review || 'No AI review available'}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <div>
                                                                <h4 className="mb-2 text-sm font-medium">Teacher's Feedback</h4>
                                                                <div className="bg-muted rounded-lg p-4">
                                                                    <p className="text-muted-foreground text-sm">
                                                                        {result.comment || 'No feedback provided'}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                )}

                                                {result.status === 'pending' && (
                                                    <div className="bg-muted rounded-lg p-4">
                                                        <p className="text-muted-foreground">
                                                            Your submission is being processed. Please check back later.
                                                        </p>
                                                    </div>
                                                )}

                                                {result.status === 'reviewed' && (
                                                    <div className="bg-muted rounded-lg p-4">
                                                        <p className="text-muted-foreground">
                                                            Your submission has been reviewed by AI. Waiting for teacher's final grade.
                                                        </p>
                                                    </div>
                                                )}

                                                {result.status === 'graded' && (
                                                    <div className="bg-muted rounded-lg p-4">
                                                        <p className="text-muted-foreground">
                                                            Your submission has been graded. Waiting for the grade to be published.
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                ))}
                            </div>
                        ) : (
                            <Alert>
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>No recent results</AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
