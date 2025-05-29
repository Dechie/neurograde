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
