import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { ClassRoom, Department, Student, StudentListPageProps } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { route } from 'ziggy-js';

export default function StudentList() {
    const { students = [], classes = [], departments = [], errors } = usePage<StudentListPageProps>().props;

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [selectedClass, setSelectedClass] = useState<string>('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [activeDepartmentId, setActiveDepartmentId] = useState<string>('all');
    const [dialogError, setDialogError] = useState<string | null>(null);

    const filteredStudents = useMemo(() => {
        if (!students) return [];

        return students.filter((student) => {
            const matchesDepartment = activeDepartmentId === 'all' || student.department.id.toString() === activeDepartmentId;
            const fullName = `${student.user.first_name} ${student.user.last_name}`.toLowerCase();
            const matchesSearch = fullName.includes(searchTerm.toLowerCase());
            return matchesDepartment && matchesSearch;
        });
    }, [students, activeDepartmentId, searchTerm]);

    const filteredClassesForStudent = useMemo(() => {
        if (!selectedStudent) return [];
        return classes.filter((classItem) => String(classItem.department_id) === String(selectedStudent.department.id));
    }, [selectedStudent, classes]);

    useEffect(() => {
        if (!isDialogOpen) {
            setDialogError(null);
            setSelectedClass('');
        }

        if (selectedStudent && isDialogOpen) {
            setSelectedClass('');
            setDialogError(null);
        }
    }, [isDialogOpen, selectedStudent]);

    const handleAssignClass = () => {
        setDialogError(null);

        if (!selectedStudent || !selectedClass) {
            setDialogError('Please select a class.');
            return;
        }

        router.patch(
            route('admin.classes.assign-students', { class: selectedClass }),
            {
                student_ids: [selectedStudent.id],
            },
            {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    setSelectedStudent(null);
                    setSelectedClass('');
                },
                onError: (backendErrors) => {
                    if (backendErrors.student_ids) {
                        setDialogError(backendErrors.student_ids);
                    } else {
                        setDialogError('An unexpected error occurred. Please try again.');
                    }
                },
            },
        );
    };

    return (
        <div className="container mx-auto space-y-4 py-2">
            <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
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
                                    {student.classes.length === 0 && (
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
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {filteredStudents?.length === 0 && (
                    <div className="text-muted-foreground p-4 text-center">No students match your search and filter criteria.</div>
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
                        <Select onValueChange={setSelectedClass} value={selectedClass}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a class" />
                            </SelectTrigger>
                            <SelectContent>
                                {filteredClassesForStudent?.map((classItem: ClassRoom) => (
                                    <SelectItem key={classItem.id} value={String(classItem.id)}>
                                        {classItem.name}
                                    </SelectItem>
                                ))}
                                {filteredClassesForStudent?.length === 0 && (
                                    <div className="text-muted-foreground p-2 text-center text-sm">
                                        No classes available in this student's department.
                                    </div>
                                )}
                            </SelectContent>
                        </Select>

                        {dialogError && <InputError message={dialogError} className="mt-2" />}
                    </div>

                    <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleAssignClass} disabled={!selectedClass || !selectedStudent}>
                            Assign
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
