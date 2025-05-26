'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppLayout } from '@/layouts/dashboard/teacherDashboard/teacherDashboardLayout';
import { Link, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search, Trash2, Pencil } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useEffect } from 'react';
import { CreateExamDialog } from '@/components/dashboard/teacherDashboard/CreateExamDialog';
import { Test, ClassRoom } from '@/types'; // Import Test from @types
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
import { EditExamDialog } from '@/components/dashboard/teacherDashboard/EditExamDialog';
import { toast } from '@/components/ui/use-toast';

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
    
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [currentTest, setCurrentTest] = useState<Test | null>(null);

    // Debug props.tests
    useEffect(() => {
        console.log('Initial tests data:', props.tests);
        console.log('Tests state:', tests);
    }, [props.tests, tests]);

    const filteredTests = tests.filter(test => {
        const matchesSearch = test.title?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false;
        const matchesStatus = statusFilter === "all" || getTestStatus(test.due_date) === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleCreateSuccess = () => {
        // Refresh the page data using Inertia
        router.reload({ 
            only: ['tests'],
            onSuccess: () => {
                toast({
                    title: "Success",
                    description: "Exam created successfully!",
                    variant: "default",
                });
            }
        });
    };

    const handleEditSuccess = () => {
        setTests([...tests, ...props.tests?.filter(t => !tests.find(existing => existing.id === t.id)) || []]);
        toast({
            title: "Success",
            description: "Exam updated successfully!",
            variant: "default",
        });
    };

    const handleDelete = async () => {
        if (!currentTest) return;
        
        try {
            await router.delete(route('teacher.tests.destroy', currentTest.id), {
                onSuccess: () => {
                    setTests(tests.filter(test => test.id !== currentTest.id));
                    toast({
                        title: "Success",
                        description: "Exam deleted successfully!",
                        variant: "default",
                    });
                },
                onError: (errors) => {
                    toast({
                        title: "Error",
                        description: 'Failed to delete exam',
                        variant: "destructive",
                    });
                    console.error('Delete failed:', errors);
                },
            });
        } catch (err) {
            toast({
                title: "Error",
                description: err instanceof Error ? err.message : 'Failed to delete exam',
                variant: "destructive",
            });
            console.error('Error deleting exam:', err);
        } finally {
            setIsDeleteDialogOpen(false);
            setCurrentTest(null);
        }
    };

    function getTestStatus(dueDate: string) {
        if (!dueDate) return 'No due date';
        const now = new Date();
        const due = new Date(dueDate);
        return due < now ? 'Past Due' : 
               (due.getTime() - now.getTime() < 24 * 60 * 60 * 1000 ? 'Due Soon' : 'Upcoming');
    }

    if (isLoading) {
        return (
            <AppLayout title="Tests">
                <div className="flex justify-center items-center h-64">
                    <p>Loading exams...</p>
                </div>
            </AppLayout>
        );
    }

    if (error) {
        return (
            <AppLayout title="Tests">
                <div className="flex justify-center items-center h-64">
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="relative w-full sm:w-1/2">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search tests by title..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Select 
                            value={statusFilter}
                            onValueChange={(value) => setStatusFilter(value)}
                        >
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

                        <Button 
                            onClick={() => setIsCreateDialogOpen(true)}
                            className="ml-auto"
                        >
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Create Exam
                        </Button>
                    </div>
                </div>

                {/* Tests Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTests.length > 0 ? (
                        filteredTests.map((test) => (
                            <div key={test.id} className="relative group">
                                <Link href={route('teacher.tests.show', test.id)}>
                                    <Card className="hover:shadow-lg transition-shadow h-full">
                                        <CardHeader>
                                            <CardTitle className="text-lg">{test.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-2">
                                                <p className="text-sm text-muted-foreground">
                                                    Class: {test.class?.name || test.class_name || 'N/A'}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    Department: {test.department?.name || 'N/A'}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    Due: {test.due_date ? new Date(test.due_date).toLocaleDateString() : 'No due date'}
                                                </p>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">
                                                        Submissions: {test.submissions?.length || 0}
                                                    </span>
                                                    {/* <span className="text-muted-foreground">
                                                        Graded: {test.submissions?.filter(s => s.graded).length || 0}
                                                    </span> */}
                                                    <span className="text-muted-foreground">
                                                        Published: {test.published ? 1 : 0}
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
                                                    <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        getTestStatus(test.due_date) === 'Upcoming' ? 'bg-blue-100 text-blue-800' :
                                                        getTestStatus(test.due_date) === 'Due Soon' ? 'bg-orange-100 text-orange-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                        {getTestStatus(test.due_date)}
                                                    </span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                                
                                {/* Edit and Delete buttons */}
                                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="p-2 h-8 w-8"
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
                                        className="p-2 h-8 w-8 text-red-500 hover:text-red-700"
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
                                <p className="text-muted-foreground">
                                    {tests.length === 0 ? 'No tests created yet.' : 'No matching tests found.'}
                                </p>
                                <Button 
                                    className="mt-4"
                                    onClick={() => setIsCreateDialogOpen(true)}
                                >
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
                            <AlertDialogAction 
                                onClick={handleDelete}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AppLayout>
    );
}