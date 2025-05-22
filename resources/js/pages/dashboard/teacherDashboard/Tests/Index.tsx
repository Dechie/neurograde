import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppLayout } from '@/layouts/dashboard/teacherDashboard/teacherDashboardLayout';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface Test {
    id: number;
    title: string;
    problem_statement: string;
    due_date: string;
    status: string;
    published: boolean;
    class: {
        id: number;
        name: string;
        department: string;
    } | null;
    submissions_count: number;
    graded_count: number;
    published_count: number;
}

interface TestsPageProps {
    tests: Test[];
}

export default function TestsIndex({ tests }: TestsPageProps) {
    return (
        <AppLayout title="Tests">
            <div className="space-y-6 p-6">
                {/* Header with Create Test button */}
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Tests</h1>
                    <Link href={route('teacher.tests.create')}>
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Create Test
                        </Button>
                    </Link>
                </div>

                {/* Tests Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tests.map((test) => (
                        <Link key={test.id} href={route('teacher.tests.show', test.id)}>
                            <Card className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <CardTitle className="text-lg">{test.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <p className="text-sm text-muted-foreground">
                                            Class: {test.class?.name || 'N/A'}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Department: {test.class?.department || 'N/A'}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Due: {test.due_date ? new Date(test.due_date).toLocaleDateString() : 'No due date'}
                                        </p>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">
                                                Submissions: {test.submissions_count}
                                            </span>
                                            <span className="text-muted-foreground">
                                                Graded: {test.graded_count}
                                            </span>
                                            <span className="text-muted-foreground">
                                                Published: {test.published_count}
                                            </span>
                                        </div>
                                        <div className="mt-2">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                test.published 
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {test.published ? 'Published' : 'Draft'}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>

                {/* Empty State */}
                {tests.length === 0 && (
                    <Card>
                        <CardContent className="p-6 text-center">
                            <p className="text-muted-foreground">No tests created yet.</p>
                            <Link href={route('teacher.tests.create')}>
                                <Button className="mt-4">
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Create Your First Test
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
} 