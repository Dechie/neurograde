'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { ClassRoom, Department, Student, StudentListPageProps } from '@/types'; // Import from types file
import { router, usePage } from '@inertiajs/react'; // Import router
import { useState, useEffect, useMemo } from 'react'; // Import useEffect and useMemo
import { route } from 'ziggy-js';
import InputError from '@/components/input-error'; // Assuming you have an InputError component


export default function StudentList() {
    // Access the data and errors from Inertia page props
    const { students = [], classes = [], departments = [], errors } = usePage<StudentListPageProps>().props;

    // Debug logging to verify data
    useEffect(() => {
        console.log('Total students:', students?.length || 0);
        console.log('Unassigned students:', students?.filter(student => student.classes.length === 0).length || 0);
    }, [students]);

    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [selectedClass, setSelectedClass] = useState<string>('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [activeDepartmentId, setActiveDepartmentId] = useState<string | 'all'>('all');
    const [dialogError, setDialogError] = useState<string | null>(null);

    // Filter students based on the active department tab
    const filteredStudents = useMemo(() => {
        if (!students) return [];
        
        let filtered: Student[] = [];
        
        if (activeDepartmentId === 'all') {
            filtered = [...students];
        } else {
            filtered = students.filter((student) => student.department.id.toString() === activeDepartmentId);
        }
        
        console.log('Filtered students count:', filtered.length);
        console.log('Unassigned students in filtered:', filtered.filter(s => s.classes.length === 0).length);
        
        return filtered;
    }, [students, activeDepartmentId]);

    // Filter classes based on the selected student's department
    const filteredClassesForStudent = useMemo(() => {
        if (!selectedStudent) return [];
        const filtered = classes.filter(
            classItem => String(classItem.department_id) === String(selectedStudent.department.id)
        );
        console.log('All classes:', classes);
        console.log('Selected student:', selectedStudent);
        console.log('Filtered classes for student:', filtered);
        return filtered;
    }, [selectedStudent, classes]);

    // Effect to clear dialog error and selected class when dialog is closed or selected student changes
    useEffect(() => {
        if (!isDialogOpen) {
            setDialogError(null); // Clear error when dialog closes
            setSelectedClass(''); // Clear selected class when dialog closes
        }
         // Also clear selected class when a new student is selected
        if (selectedStudent && isDialogOpen) {
             setSelectedClass('');
             setDialogError(null); // Also clear error when a new student is selected in the dialog
        }
    }, [isDialogOpen, selectedStudent]); // Depend on isDialogOpen and selectedStudent


    // Handle assigning a class
    const handleAssignClass = () => {
        // Clear previous dialog errors
        setDialogError(null);

        if (!selectedStudent || !selectedClass) {
            // Optionally set a local error if validation is done client-side too
            setDialogError("Please select a class."); // Updated message
            return;
        }

        console.log(`Attempting to assign Class ID ${selectedClass} to Student ID ${selectedStudent.id}`);

        // API call to assign class to student using router.patch
        router.patch(
            // Use route helper with the correct route name and parameters
            route('admin.classes.assign-students', { class: selectedClass }),
            {
                // Send the required payload: an array of student IDs
                student_ids: [selectedStudent.id],
            },
            {
                onSuccess: () => {
                    console.log('Class assigned successfully via API');
                    // Inertia will handle the redirect or prop update, which will re-render the list
                    // The flash message listener will show the success toast (if you implemented it)
                    setIsDialogOpen(false); // Close dialog on success
                    setSelectedStudent(null); // Reset selected student state
                    setSelectedClass(''); // Reset selected class state
                },
                onError: (backendErrors) => {
                    console.error('Failed to assign class via API', backendErrors);
                    // Check if there is a specific error for 'student_ids' (from backend validation)
                    if (backendErrors.student_ids) {
                         setDialogError(backendErrors.student_ids); // Set the backend error message
                    } else {
                         // Handle other potential errors if needed
                         setDialogError("An unexpected error occurred. Please try again.");
                    }
                },
                onFinish: () => {
                    // Optional: Any cleanup after submission attempt
                },
            },
        );
    };

    return (
        <div className="container mx-auto py-6">
            <h1 className="mb-6 text-2xl font-bold">Student Management</h1>

            {/* Department Filter Tabs */}
            <Tabs value={activeDepartmentId} onValueChange={setActiveDepartmentId} className="mb-6">
                <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 lg:grid-cols-8">
                    <TabsTrigger value="all">All Departments</TabsTrigger>
                    {/* Use imported Department interface in map */}
                    {departments?.map((dept: Department) => (
                        <TabsTrigger key={dept.id} value={dept.id.toString()}>
                            {dept.name}
                        </TabsTrigger>
                    ))}
                </TabsList>
                <TabsContent value={activeDepartmentId} className="mt-0"></TabsContent>
            </Tabs>

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
                        {/* Use imported Student interface in map */}
                        {filteredStudents?.map((student: Student) => (
                            <TableRow key={student.id}>
                                <TableCell className="font-medium">
                                    {student.user.first_name} {student.user.last_name}
                                </TableCell>
                                <TableCell>{student.department.name}</TableCell>
                                <TableCell>
                                    <Badge variant={student.classes.length > 0 ? 'default' : 'secondary'}>
                                        {student.classes.length > 0 ? 'Assigned' : 'Unassigned'}
                                    </Badge>
                                </TableCell>
                                <TableCell>{student.classes.length > 0 ? student.classes.map((c) => c.name).join(', ') : 'None'}</TableCell>
                                <TableCell>
                                    { student.classes.length === 0 && (
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                            setSelectedStudent(student); // Set the selected student
                                            setIsDialogOpen(true); // Open the dialog
                                            // selectedClass and dialogError are cleared by useEffect
                                        }}
                                    >
                                        Assign Class
                                    </Button>
)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {/* Optional: Message if no students found after filtering */}
                {filteredStudents?.length === 0 && (
                    <div className="text-muted-foreground p-4 text-center">No students found for this department.</div>
                )}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Assign Class to {selectedStudent?.user.first_name} {selectedStudent?.user.last_name}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        {/* Select component to choose which class to assign */}
                        <Select onValueChange={setSelectedClass} value={selectedClass}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a class" />
                            </SelectTrigger>
                            <SelectContent>
                                {/* Map over the FILTERED classes */}
                                {filteredClassesForStudent?.map((classItem: ClassRoom) => (
                                    <SelectItem key={classItem.id} value={String(classItem.id)}>
                                        {classItem.name}
                                    </SelectItem>
                                ))}
                                 {/* Message if no classes available for the student's department */}
                                 {filteredClassesForStudent?.length === 0 && (
                                     <div className="p-2 text-center text-muted-foreground text-sm">No classes available in this student's department.</div>
                                 )}
                            </SelectContent>
                        </Select>

                         {/* --- Display Validation Error --- */}
                         {/* Check if there is a dialogError state set */}
                         {dialogError && (
                             <InputError message={dialogError} className="mt-2" />
                         )}
                         {/* --- End Display Validation Error --- */}

                    </div>

                    <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                        </Button>
                        {/* Disable button if no class is selected in the dialog */}
                        <Button onClick={handleAssignClass} disabled={!selectedClass || !selectedStudent}>
                            Assign
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
