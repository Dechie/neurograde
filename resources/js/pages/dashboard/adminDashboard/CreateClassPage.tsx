import { AppLayout } from '@/layouts/dashboard/adminDashboard/AdminDashboardLayout';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Department, Teacher, ClassRoom, PageProps } from '@/types';
import { usePage } from '@inertiajs/react';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { CreateClassForm } from '@/components/dashboard/adminDashboard/CreateClassForm';
import { Card } from '@/components/ui/card';

interface ClassListPageProps extends PageProps {
    classes: ClassRoom[];
    departments: Department[];
    teachers: Teacher[];
}

export default function ClassListPage() {
    const { classes, departments, teachers } = usePage<ClassListPageProps>().props;
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

    const classList = classes || [];

    return (
        <AppLayout>
            <div className="container mx-auto px-4 py-8 space-y-6">
                <div className="flex justify-end w-full">
                    <Button 
                        onClick={() => setIsCreateDialogOpen(true)} 
                        className="gap-2"
                    >
                        <PlusIcon className="h-4 w-4" />
                        Create New Class
                    </Button>
                </div>

                <Card>
                    <Table>
                        <TableCaption>A list of all classes in the system.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Class Name</TableHead>
                                <TableHead>Department</TableHead>
                                <TableHead>Assigned Teachers</TableHead>
                                <TableHead>Max Students</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {classList.length > 0 ? (
                                classList.map((cls) => (
                                    <TableRow key={cls.id}>
                                        <TableCell className="font-medium">{cls.name}</TableCell>
                                        <TableCell>{cls.department?.name || 'N/A'}</TableCell>
                                        <TableCell>
                                            {/* {cls.teachers?.map(t => t.user?.name).join(', ') || 'None'} */}
                                        </TableCell>
                                        {/* <TableCell>{cls.max_students || 'N/A'}</TableCell> */}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        No classes found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Card>

                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogContent className="sm:max-w-[625px]">
                        <DialogHeader>
                            <DialogTitle>Create New Class</DialogTitle>
                        </DialogHeader>
                        <CreateClassForm 
                            departments={departments} 
                            // teachers={teachers}
                            onSuccess={() => setIsCreateDialogOpen(false)}
                        />
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}