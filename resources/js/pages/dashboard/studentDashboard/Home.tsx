import { AppLayout } from '@/layouts/dashboard/studentDashboard/studentDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { HomeProps } from '@/types';

const defaultStatistics = {
    total_tests: 0,
    completed_tests: 0,
    pending_submissions: 0,
    average_score: 0
};

export default function Home({ user, upcomingTests, recentResults, statistics = defaultStatistics }: HomeProps) {
    return (
        <AppLayout title="Dashboard">
            <div className="space-y-6">
                
                <div className="bg-primary text-primary-foreground rounded-lg p-6">
                <h1 className="text-2xl font-bold">Welcome back, {user.name}</h1>
                                    <p className="text-muted-foreground">Student ID: {user.student.id_number}</p>

                <p>Here's an overview of your academic progress and upcoming tests.</p>
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

               <div className="flex flex-row gap-4">
    {/* Upcoming Tests */}
    <Card className="flex-1">
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
                                    {test.class_name} • Due {new Date(test.due_date).toLocaleDateString()}
                                </p>
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
    <Card className="flex-1">
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
                                <p className="font-medium">{result.score ?? 'Pending'}</p>
                                <p className="text-sm text-muted-foreground">{result.status}</p>
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
            </div>
        </AppLayout>
    );
}