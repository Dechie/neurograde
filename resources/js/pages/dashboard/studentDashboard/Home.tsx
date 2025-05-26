import { AppLayout } from '@/layouts/dashboard/studentDashboard/studentDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
    test: {
        id: number;
        title: string;
    };
    score: number | null;
    status: 'pending' | 'graded' | 'published' | 'reviewed';
    submission_date: string;
    comment?: string;
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

                {/* Upcoming Tests */}
                <Card>
                    <CardHeader>
                        <CardTitle>Upcoming Tests</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {upcomingTests.length > 0 ? (
                            <div className="space-y-4">
                                {upcomingTests.map((test) => (
                                    <div key={test.id} className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-medium">{test.title}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                {test.class_name} • {test.department} • Due {new Date(test.due_date).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div>
                                            {test.has_submitted ? (
                                                <Badge variant="success">Submitted</Badge>
                                            ) : (
                                                <Badge variant="outline">Not Submitted</Badge>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <Alert>
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>No upcoming tests</AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Results */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Results</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {recentResults.length > 0 ? (
                            <div className="space-y-4">
                                {recentResults.map((result) => (
                                    <div key={result.id} className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-medium">{result.test.title}</h3>
                                            <p className="text-sm text-muted-foreground">
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
                                            {result.status === 'published' && result.comment && (
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {result.comment}
                                                </p>
                                            )}
                                        </div>
                                    </div>
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