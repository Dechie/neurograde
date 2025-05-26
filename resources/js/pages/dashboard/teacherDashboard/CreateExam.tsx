'use client';

import { CreateExamDialog } from '@/components/dashboard/teacherDashboard/CreateExamDialog';
import { EditExamDialog } from '@/components/dashboard/teacherDashboard/EditExamDialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { AppLayout } from '@/layouts/dashboard/teacherDashboard/teacherDashboardLayout';
import { ClassRoom, Test } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { Pencil, PlusCircle, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function CreateExam() {
    const { props } = usePage<{
        tests?: Test[];
        classes?: ClassRoom[];
    }>();

    // State for loading and error handling
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Provide default empty arrays if props are undefined
    const [tests, setTests] = useState<Test[]>(props.tests || []);
    const classes = props.classes || [];

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [currentTest, setCurrentTest] = useState<Test | null>(null);

    useEffect(() => {
        console.log('Initial tests data:', props.tests);
        console.log('Tests state:', tests);
    }, [props.tests, tests]);

    const filteredTests = tests.filter((test) => {
        const matchesSearch = test.title?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false;
        const matchesStatus = statusFilter === 'all' || getTestStatus(test.due_date) === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleCreateSuccess = () => {
        router.reload({
            only: ['tests'],
            onSuccess: () => {
                toast({
                    title: 'Success',
                    description: 'Exam created successfully!',
                    variant: 'default',
                });
            },
        });
    };

     const handleEditSuccess = () => {
        setTests([...tests, ...(props.tests?.filter((t) => !tests.find((existing) => existing.id === t.id)) || [])]);
        toast({
            title: 'Success',
            description: 'Exam updated successfully!',
            variant: 'default',
        });
    };

    const handleDelete = async () => {
        if (!currentTest) return;

        console.log('Starting deletion of test ID:', currentTest.id);
        setIsLoading(true);

        try {
            const response = await router.delete(route('teacher.tests.destroy', { test: currentTest.id }), {
                preserveScroll: true,
                onSuccess: () => {
                    console.log('Successfully deleted test ID:', currentTest.id);
                    setTests(tests.filter((test) => test.id !== currentTest.id));
                    toast({
                        title: 'Success',
                        description: 'Exam deleted successfully!',
                        variant: 'default',
                    });
                },
                onError: (err) => {
                    console.error('Error deleting test:', err);
                    toast({
                        title: 'Error',
                        description: 'Failed to delete exam',
                        variant: 'destructive',
                    });
                },
            });
        } catch (err) {
            console.error('Unexpected error during deletion:', err);
            toast({
                title: 'Error',
                description: 'An unexpected error occurred while deleting the exam.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
            setIsDeleteDialogOpen(false);
            setCurrentTest(null);
        }
    };

    function getTestStatus(dueDate: string) {
        if (!dueDate) return 'No due date';
        const now = new Date();
        const due = new Date(dueDate);
        return due < now ? 'Past Due' : due.getTime() - now.getTime() < 24 * 60 * 60 * 1000 ? 'Due Soon' : 'Upcoming';
    }

    if (isLoading) {
        return (
            <AppLayout title="Tests">
                <div className="flex h-64 items-center justify-center">
                    <p>Loading exams...</p>
                </div>
            </AppLayout>
        );
    }

    if (error) {
        return (
            <AppLayout title="Tests">
                <div className="flex h-64 items-center justify-center">
                    <div className="text-red-500">{error}</div>
                    <Button onClick={() => setTests(props.tests || [])} className="ml-4">
                        Retry
                    </Button>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout title="Tests">
            <div className="space-y-6 p-6">
                {/* Header with Search and Create Test button */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="relative w-full sm:w-1/2">
                        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                        <Input
                            placeholder="Search tests by title..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex w-full items-center gap-2 sm:w-auto">
                        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value)}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="Upcoming">Upcoming</SelectItem>
                                <SelectItem value="Due Soon">Due Soon</SelectItem>
                                <SelectItem value="Past Due">Past Due</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button onClick={() => setIsCreateDialogOpen(true)} className="ml-auto">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Create Exam
                        </Button>
                    </div>
                </div>

                {/* Tests Grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredTests.length > 0 ? (
                        filteredTests.map((test) => (
                            <div key={test.id} className="group relative">
                                <Link href={route('teacher.tests.show', test.id)}>
                                    <Card className="h-full transition-shadow hover:shadow-lg">
                                        <CardHeader>
                                            <CardTitle className="text-lg">{test.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-2">
                                                <p className="text-muted-foreground text-sm">Class: {test.class?.name || test.class_name || 'N/A'}</p>
                                                <p className="text-muted-foreground text-sm">Department: {test.department?.name || 'N/A'}</p>
                                                <p className="text-muted-foreground text-sm">
                                                    Due: {test.due_date ? new Date(test.due_date).toLocaleDateString() : 'No due date'}
                                                </p>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">Submissions: {test.submissions?.length || 0}</span>
                                                    {/* <span className="text-muted-foreground">
                                                        Graded: {test.submissions?.filter(s => s.graded).length || 0}
                                                    </span> */}
                                                    <span className="text-muted-foreground">Published: {test.published ? 1 : 0}</span>
                                                </div>
                                                <div className="mt-2">
                                                    <span
                                                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                            test.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                        }`}
                                                    >
                                                        {test.published ? 'Published' : 'Draft'}
                                                    </span>
                                                    <span
                                                        className={`ml-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                            getTestStatus(test.due_date) === 'Upcoming'
                                                                ? 'bg-blue-100 text-blue-800'
                                                                : getTestStatus(test.due_date) === 'Due Soon'
                                                                  ? 'bg-orange-100 text-orange-800'
                                                                  : 'bg-red-100 text-red-800'
                                                        }`}
                                                    >
                                                        {getTestStatus(test.due_date)}
                                                    </span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>

                                {/* Edit and Delete buttons */}
                                <div className="absolute top-4 right-4 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-2"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setCurrentTest(test);
                                            setIsEditDialogOpen(true);
                                        }}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-2 text-red-500 hover:text-red-700"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setCurrentTest(test);
                                            setIsDeleteDialogOpen(true);
                                        }}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <Card className="col-span-full">
                            <CardContent className="p-6 text-center">
                                <p className="text-muted-foreground">{tests.length === 0 ? 'No tests created yet.' : 'No matching tests found.'}</p>
                                <Button className="mt-4" onClick={() => setIsCreateDialogOpen(true)}>
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    {tests.length === 0 ? 'Create Your First Test' : 'Create New Test'}
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Create Exam Dialog */}
                <CreateExamDialog
                    open={isCreateDialogOpen}
                    onOpenChange={setIsCreateDialogOpen}
                    classes={classes}
                    onExamCreated={handleCreateSuccess}
                />

                {/* Edit Exam Dialog */}
                {currentTest && (
                    <EditExamDialog
                        open={isEditDialogOpen}
                        onOpenChange={setIsEditDialogOpen}
                        classes={classes}
                        exam={currentTest}
                        onExamUpdated={handleEditSuccess}
                    />
                )}

                {/* Delete Confirmation Dialog */}
                <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the exam "{currentTest?.title}" and all its submissions.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AppLayout>
    );
}

