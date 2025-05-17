import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { usePage } from '@inertiajs/react';
import { useState } from 'react';
// Import model and page props interfaces from your types file
import { ClassRoom, Teacher, TeacherListPageProps } from '@/types'; // Import from types file

export default function TeacherList() {
    // Access the data from Inertia page props using the specific PageProps interface
    const { teachers, classes, departments } = usePage<TeacherListPageProps>().props;

    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
    const [selectedClass, setSelectedClass] = useState<string>('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    // State to manage the active department tab filter (Optional for TeacherList)
    // const [activeDepartmentId, setActiveDepartmentId] = useState<string | 'all'>('all');

    // Filter teachers based on department (Optional)
    // const filteredTeachers = activeDepartmentId === 'all'
    //   ? teachers
    //   : teachers.filter(teacher => teacher.department.id.toString() === activeDepartmentId);

    // Handle assigning a class (Placeholder for API call)
    const handleAssignClass = () => {
        if (!selectedTeacher || !selectedClass) return;

        console.log(`Attempting to assign Class ID ${selectedClass} to Teacher ID ${selectedTeacher.id}`);

        // --- API call to assign class to teacher ---
        // You would need a backend endpoint for this, e.g., PATCH /admin/teachers/{teacher}/assign-class
        // Inertia.patch(route('admin.teachers.assign-class', selectedTeacher.id), {
        //     class_id: selectedClass, // Send the selected class ID
        // }, {
        //     onSuccess: () => {
        //         console.log('Class assigned successfully via API');
        //         // Inertia will handle the redirect or prop update, which will re-render the list
        //         // The flash message listener will show the success toast
        //         setIsDialogOpen(false); // Close dialog on success
        //         setSelectedTeacher(null);
        //         setSelectedClass("");
        //     },
        //     onError: (errors) => {
        //         console.error('Failed to assign class via API', errors);
        //         // Handle API errors
        //     }
        // });
        // --- End API call ---
    };

    return (
        <div className="container mx-auto py-6">
            <h1 className="mb-6 text-2xl font-bold">Teacher Management</h1>

            {/* Department Filter Tabs (Optional for TeacherList) */}
            {/* <Tabs value={activeDepartmentId} onValueChange={setActiveDepartmentId} className="mb-6">
             <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 lg:grid-cols-8">
               <TabsTrigger value="all">All Departments</TabsTrigger>
               {departments?.map(dept => (
                 <TabsTrigger key={dept.id} value={dept.id.toString()}>{dept.name}</TabsTrigger>
               ))}
             </TabsList>
             <TabsContent value={activeDepartmentId} className="mt-0">
             </TabsContent>
           </Tabs> */}

            <div className="rounded-lg bg-white shadow">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Department</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Assigned Classes</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {/* Use imported Teacher interface in map */}
                        {teachers?.map((teacher: Teacher) => (
                            <TableRow key={teacher.id}>
                                <TableCell className="font-medium">
                                    {teacher.user.first_name} {teacher.user.last_name}
                                </TableCell>
                                <TableCell>{teacher.department.name}</TableCell>
                                <TableCell>
                                    <Badge variant={teacher.classes.length > 0 ? 'default' : 'secondary'}>
                                        {teacher.classes.length > 0 ? 'Assigned' : 'Unassigned'}
                                    </Badge>
                                </TableCell>
                                <TableCell>{teacher.classes.length > 0 ? teacher.classes.map((c) => c.name).join(', ') : 'None'}</TableCell>
                                <TableCell>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                            setSelectedTeacher(teacher);
                                            setIsDialogOpen(true);
                                        }}
                                    >
                                        Assign Class
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {/* Optional: Message if no teachers found */}
                {teachers?.length === 0 && <div className="text-muted-foreground p-4 text-center">No teachers found.</div>}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Assign Class to {selectedTeacher?.user.first_name} {selectedTeacher?.user.last_name}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <Select onValueChange={setSelectedClass} value={selectedClass}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a class" />
                            </SelectTrigger>
                            <SelectContent>
                                {/* Use imported ClassRoom interface in map */}
                                {classes?.map((classItem: ClassRoom) => (
                                    <SelectItem key={classItem.id} value={String(classItem.id)}>
                                        {classItem.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleAssignClass} disabled={!selectedClass || !selectedTeacher}>
                                Assign
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
