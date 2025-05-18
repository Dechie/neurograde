"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs" // Assuming you might add department tabs later
import { router, usePage } from "@inertiajs/react" // Import router
import { useState } from "react"
// Import model and page props interfaces from your types file
import type { ClassRoom, Department, Teacher, TeacherListPageProps } from "@/types" // Import from types file
import { route } from "ziggy-js"

export default function TeacherList() {
    // Access the data from Inertia page props using the specific PageProps interface
    const { teachers, classes, departments } = usePage<TeacherListPageProps>().props;

    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
    // The dialog now selects a CLASS to assign TO the selected teacher
    const [selectedClassToAssign, setSelectedClassToAssign] = useState<string>(""); // Renamed for clarity
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    // State to manage the active department tab filter (Optional for TeacherList)
    // const [activeDepartmentId, setActiveDepartmentId] = useState<string | 'all'>('all');

    // Filter teachers based on department (Optional)
    // const filteredTeachers = activeDepartmentId === 'all'
    //   ? teachers
    //   : teachers.filter(teacher => teacher.department.id.toString() === activeDepartmentId);

    // Handle assigning a class TO the selected teacher
    const handleAssignClass = () => {
        // Ensure a teacher is selected and a class is selected in the dialog
        if (!selectedTeacher || !selectedClassToAssign) return;

        console.log(`Attempting to assign Teacher ID ${selectedTeacher.id} to Class ID ${selectedClassToAssign}`);

        // --- API call to assign the selected teacher TO the selected class ---
        // Use router.patch to update the class record
        router.patch(
            // Route: admin.classes.assign-teacher
            // Parameter: { class: selectedClassToAssign } - the ID of the class being updated
            route('admin.classes.assign-teacher', { class: selectedClassToAssign }),
            {
                // Payload: Send the ID of the teacher to assign to this class
                teacher_id: selectedTeacher.id,
            },
            {
                // onSuccess callback handles a successful response (after redirect)
                onSuccess: () => {
                    console.log("Teacher assigned to class successfully via API");
                    // Inertia will handle the redirect to admin.teachers.index (or admin.classes.index)
                    // The flash message listener will show the success toast
                    setIsDialogOpen(false); // Close dialog on success
                    setSelectedTeacher(null); // Reset selected teacher state
                    setSelectedClassToAssign(""); // Reset selected class state
                },
                // onError callback handles validation errors or other API errors
                onError: (errors) => {
                    console.error("Failed to assign teacher to class via API", errors);
                    // Handle errors. Validation errors from the backend will be in errors object.
                    // You might display them in the dialog or rely on flash messages for general errors.
                },
                // onFinish callback runs after success or error
                onFinish: () => {
                    // Optional: Any cleanup or state reset that should happen regardless of success/failure
                }
            },
        );
    };

    return (
        <div className="container mx-auto py-6">
            <h1 className="mb-6 text-2xl font-bold">Teacher Management</h1>

            {/* Department Filter Tabs (Optional for TeacherList) */}
            {/* ... (tabs code remains the same) ... */}

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
                        {/* Map over the teachers prop */}
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
                                    {/* Button to open dialog to assign a class TO this teacher */}
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                            setSelectedTeacher(teacher); // Set the teacher being assigned a class
                                            setIsDialogOpen(true); // Open the dialog
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
                        {/* Select component to choose which class to assign the teacher TO */}
                        <Select onValueChange={setSelectedClassToAssign} value={selectedClassToAssign}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a class" />
                            </SelectTrigger>
                            <SelectContent>
                                {/* Use imported ClassRoom interface in map */}
                                {classes?.map((classItem: ClassRoom) => (
                                    <SelectItem key={classItem.id} value={String(classItem.id)}>
                                        {classItem.name} ({classItem.department?.name}) {/* Show class name and department */}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Cancel
                            </Button>
                            {/* Disable button if no class is selected in the dialog */}
                            <Button onClick={handleAssignClass} disabled={!selectedClassToAssign}>
                                Assign
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
