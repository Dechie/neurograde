// "use client"

// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs" // Assuming you might add department tabs later
// import { router, usePage } from "@inertiajs/react" // Import router
// import { useState } from "react"
// import type { ClassRoom, Department, Teacher, TeacherListPageProps } from "@/types" // Import from types file
// import { route } from "ziggy-js"

// export default function TeacherList() {
//     // Access the data from Inertia page props using the specific PageProps interface
//     const { teachers, classes, departments } = usePage<TeacherListPageProps>().props;

//     const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
//     // State to hold the ID of the single class selected in the dialog for assignment
//     const [selectedClassIdToAssign, setSelectedClassIdToAssign] = useState<string>(""); // State for single selected class ID
//     const [isDialogOpen, setIsDialogOpen] = useState(false);
//     // State to manage the active department tab filter (Optional for TeacherList)
//     // const [activeDepartmentId, setActiveDepartmentId] = useState<string | 'all'>('all');

//     // Filter teachers based on department (Optional)
//     // const filteredTeachers = activeDepartmentId === 'all'
//     //   ? teachers
//     //   : teachers.filter(teacher => teacher.department.id.toString() === activeDepartmentId);

//     // Handle assigning the selected teacher TO the selected single class
//     const handleAssignClassToTeacher = () => { // Renamed function for clarity
//         // Ensure a teacher is selected and a class is selected in the dialog
//         if (!selectedTeacher || !selectedClassIdToAssign) return;

//         console.log(`Attempting to assign Teacher ID ${selectedTeacher.id} to Class ID: ${selectedClassIdToAssign}`);

//         // --- API call to assign the selected single class TO the selected teacher ---
//         // Use router.patch to call the backend endpoint that assigns a teacher to a class
//         router.patch(
//              // Corrected Route Name and Parameter: admin.classes.assign-teacher expects { class }
//              route('admin.classes.assign-teacher', { class: selectedClassIdToAssign }),
//              {
//                  // Payload: Send the ID of the teacher to assign to this class
//                  teacher_id: Number(selectedTeacher.id), // Send the teacher ID as a number
//              },
//              {
//                  onSuccess: () => {
//                      console.log("Teacher assigned to class successfully via API");
//                      // Inertia will handle the redirect or prop update, which will re-render the list
//                      // The flash message listener will show the success toast
//                      setIsDialogOpen(false); // Close dialog on success
//                      setSelectedTeacher(null); // Reset selected teacher state
//                      setSelectedClassIdToAssign(""); // Reset selected class ID state
//                  },
//                  onError: (errors) => {
//                      console.error("Failed to assign teacher to class via API", errors);
//                      // Handle errors. Inertia automatically makes validation errors available in usePage().props.errors
//                      // You might want to display these errors in the dialog.
//                  },
//                  onFinish: () => {
//                      // Optional: Any cleanup after submission attempt
//                  }
//              }
//         );
//         // --- End API call ---

//     };

//     return (
//         <div className="container mx-auto py-6">
//             <h1 className="mb-6 text-2xl font-bold">Teacher Management</h1>

//             {/* Department Filter Tabs (Optional for TeacherList) */}
//             {/* ... (tabs code remains the same) ... */}

//             <div className="rounded-lg bg-white shadow">
//                 <Table>
//                     <TableHeader>
//                         <TableRow>
//                             <TableHead>Name</TableHead>
//                             <TableHead>Department</TableHead>
//                             <TableHead>Status</TableHead>
//                             <TableHead>Assigned Classes</TableHead>
//                             <TableHead>Actions</TableHead>
//                         </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                         {/* Map over the teachers prop */}
//                         {teachers?.map((teacher: Teacher) => (
//                             <TableRow key={teacher.id}>
//                                 <TableCell className="font-medium">
//                                     {teacher.user.first_name} {teacher.user.last_name}
//                                 </TableCell>
//                                 <TableCell>{teacher.department.name}</TableCell>
//                                 <TableCell>
//                                     <Badge variant={teacher.classes.length > 0 ? 'default' : 'secondary'}>
//                                         {teacher.classes.length > 0 ? 'Assigned' : 'Unassigned'}
//                                     </Badge>
//                                 </TableCell>
//                                 <TableCell>{teacher.classes.length > 0 ? teacher.classes.map((c) => c.name).join(', ') : 'None'}</TableCell>
//                                 <TableCell>
//                                     {/* Button to open dialog to assign a single class TO this teacher */}
//                                     <Button
//                                         size="sm"
//                                         variant="outline"
//                                         onClick={() => {
//                                             setSelectedTeacher(teacher); // Set the teacher being assigned a class
//                                             // Optional: Pre-select the first assigned class if any
//                                             // setSelectedClassIdToAssign(teacher.classes.length > 0 ? String(teacher.classes[0].id) : "");
//                                             setIsDialogOpen(true); // Open the dialog
//                                         }}
//                                     >
//                                         Assign Class
//                                     </Button>
//                                 </TableCell>
//                             </TableRow>
//                         ))}
//                     </TableBody>
//                 </Table>
//                 {/* Optional: Message if no teachers found */}
//                 {teachers?.length === 0 && <div className="text-muted-foreground p-4 text-center">No teachers found.</div>}
//             </div>

//             <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//                 <DialogContent>
//                     <DialogHeader>
//                         <DialogTitle>
//                             Assign Class to {selectedTeacher?.user.first_name} {selectedTeacher?.user.last_name}
//                         </DialogTitle>
//                     </DialogHeader>

//                     <div className="space-y-4">
//                         {/* Select component to choose which single class to assign the teacher TO */}
//                         <Select onValueChange={setSelectedClassIdToAssign} value={selectedClassIdToAssign}>
//                             <SelectTrigger>
//                                 <SelectValue placeholder="Select a class" />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 {/* Use imported ClassRoom interface in map */}
//                                 {classes?.map((classItem: ClassRoom) => (
//                                     <SelectItem key={classItem.id} value={String(classItem.id)}>
//                                         {classItem.name} ({classItem.department?.name})
//                                     </SelectItem>
//                                 ))}
//                             </SelectContent>
//                         </Select>
//                         {classes?.length === 0 && (
//                             <div className="text-muted-foreground text-center text-sm">No classes available to assign.</div>
//                         )}
//                     </div>

//                     <div className="flex justify-end space-x-2">
//                         <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
//                             Cancel
//                         </Button>
//                         {/* Disable button if no class is selected in the dialog */}
//                         <Button onClick={handleAssignClassToTeacher} disabled={!selectedClassIdToAssign || !selectedTeacher}>
//                             Assign
//                         </Button>
//                     </div>
//                 </DialogContent>
//             </Dialog>
//         </div>
//     );
// }
"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { router, usePage } from "@inertiajs/react"
import { useState, useEffect } from "react" 
import type { ClassRoom, Department, Teacher, TeacherListPageProps } from "@/types"
import { route } from "ziggy-js"
import InputError from "@/components/input-error" 
import { Input } from "@/components/ui/input"; 
import { Search } from "lucide-react"

export default function TeacherList() {
    const { teachers, classes, departments, errors } = usePage<TeacherListPageProps>().props;

    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
    const [selectedClassIdToAssign, setSelectedClassIdToAssign] = useState<string>("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [activeDepartmentId, setActiveDepartmentId] = useState<string | "all">("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [dialogError, setDialogError] = useState<string | null>(null);

    useEffect(() => {
        if (!isDialogOpen) setDialogError(null);
    }, [isDialogOpen]);

    //filtering by department and by name
    const filteredTeachers = teachers.filter((teacher) => {
        const matchesDepartment =
            activeDepartmentId === "all" || teacher.department.id.toString() === activeDepartmentId;
        const matchesSearch =
            `${teacher.user.first_name} ${teacher.user.last_name}`
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
        return matchesDepartment && matchesSearch;
    });

    const handleAssignClassToTeacher = () => {
        setDialogError(null);
        if (!selectedTeacher || !selectedClassIdToAssign) {
            setDialogError("Please select a teacher and a class.");
            return;
        }

        router.patch(
            route("admin.classes.assign-teacher", { class: selectedClassIdToAssign }),
            { teacher_id: Number(selectedTeacher.id) },
            {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    setSelectedTeacher(null);
                    setSelectedClassIdToAssign("");
                },
                onError: (backendErrors) => {
                    if (backendErrors.teacher_id) {
                        setDialogError(backendErrors.teacher_id);
                    } else {
                        setDialogError("An unexpected error occurred. Please try again.");
                    }
                },
            }
        );
    };

    return (
        <div className="container mx-auto py-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0 mb-4">
                <div className="relative w-full sm:w-1/2">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="Search Teacher by Name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10" 
                    />
                </div>

                <Select onValueChange={setActiveDepartmentId} value={activeDepartmentId}>
                    <SelectTrigger className="w-full sm:w-64">
                        <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Departments</SelectItem>
                        {departments?.map((dept: Department) => (
                            <SelectItem key={dept.id} value={dept.id.toString()}>
                                {dept.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* 👇 Teacher Table */}
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
                        {filteredTeachers?.map((teacher: Teacher) => (
                            <TableRow key={teacher.id}>
                                <TableCell className="font-medium">
                                    {teacher.user.first_name} {teacher.user.last_name}
                                </TableCell>
                                <TableCell>{teacher.department.name}</TableCell>
                                <TableCell>
                                    <Badge variant={teacher.classes.length > 0 ? "default" : "secondary"}>
                                        {teacher.classes.length > 0 ? "Assigned" : "Unassigned"}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {teacher.classes.length > 0
                                        ? teacher.classes.map((c) => c.name).join(", ")
                                        : "None"}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                            setSelectedTeacher(teacher);
                                            setSelectedClassIdToAssign("");
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
                {filteredTeachers?.length === 0 && (
                    <div className="text-muted-foreground p-4 text-center">No teachers found.</div>
                )}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Assign Class to {selectedTeacher?.user.first_name} {selectedTeacher?.user.last_name}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <Select onValueChange={setSelectedClassIdToAssign} value={selectedClassIdToAssign}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a class" />
                            </SelectTrigger>
                            <SelectContent>
                                {classes?.map((classItem: ClassRoom) => (
                                    <SelectItem key={classItem.id} value={String(classItem.id)}>
                                        {classItem.name} ({classItem.department?.name})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {classes?.length === 0 && (
                            <div className="text-muted-foreground text-center text-sm">No classes available to assign.</div>
                        )}
                        {dialogError && <InputError message={dialogError} className="mt-2" />}
                    </div>

                    <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleAssignClassToTeacher} disabled={!selectedClassIdToAssign || !selectedTeacher}>
                            Assign
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
