'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { ClassRoom, Department, Student, UnassignedStudentsPageProps } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { route } from 'ziggy-js';

export default function UnassignedStudentsList() {
    const { unassignedStudents, departments, classes } = usePage<UnassignedStudentsPageProps>().props;

    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [selectedClass, setSelectedClass] = useState<string>('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredStudents = useMemo(() => {
        let result =
            selectedDepartment === 'all'
                ? unassignedStudents
                : unassignedStudents.filter((student) => student.department.id.toString() === selectedDepartment);

        if (searchTerm.trim()) {
            result = result.filter((student) => {
                const fullName = `${student.user.first_name} ${student.user.last_name}`.toLowerCase();
                return fullName.includes(searchTerm.toLowerCase());
            });
        }

        return result;
    }, [unassignedStudents, selectedDepartment, searchTerm]);

    const filteredClassesForStudent = useMemo(() => {
        if (!selectedStudent) return [];
        return classes.filter((classItem) => String(classItem.department_id) === String(selectedStudent.department.id));
    }, [selectedStudent, classes]);

    const handleAssignClass = () => {
        if (!selectedStudent || !selectedClass) return;

        router.patch(
            route('admin.classes.assign-students', { class: selectedClass }),
            { student_ids: [selectedStudent.id] },
            {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    setSelectedStudent(null);
                    setSelectedClass('');
                },
                onError: (errors) => {
                    console.error('Failed to assign class', errors);
                },
            },
        );
    };

    return (
        <div className="container mx-auto py-2">
            <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0 mb-4">
                <div className="relative w-full sm:w-1/2">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="Search Student by Name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select value={selectedDepartment} onValueChange={(value) => setSelectedDepartment(value)}>
                    <SelectTrigger className="w-full md:w-64">
                        <SelectValue placeholder="Filter by department" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Departments</SelectItem>
                        {departments.map((dept: Department) => (
                            <SelectItem key={dept.id} value={dept.id.toString()}>
                                {dept.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="rounded-lg bg-white shadow">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Department</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredStudents.map((student: Student) => (
                            <TableRow key={student.id}>
                                <TableCell className="font-medium">
                                    {student.user.first_name} {student.user.last_name}
                                </TableCell>
                                <TableCell>{student.department.name}</TableCell>
                                <TableCell>
                                    <Badge variant="secondary">Unassigned</Badge>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                            setSelectedStudent(student);
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

                {filteredStudents.length === 0 && <div className="text-muted-foreground p-4 text-center">No unassigned students found.</div>}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Assign Class to {selectedStudent?.user.first_name} {selectedStudent?.user.last_name}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <Select onValueChange={setSelectedClass} value={selectedClass}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a class" />
                            </SelectTrigger>
                            <SelectContent>
                                {filteredClassesForStudent.map((classItem: ClassRoom) => (
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
                            <Button onClick={handleAssignClass} disabled={!selectedClass}>
                                Assign
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
