import { AppLayout } from '@/layouts/dashboard/adminDashboard/AdminDashboardLayout';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Department, Teacher, ClassRoom, PageProps } from '@/types';
import { usePage } from '@inertiajs/react';
import { PlusIcon, Users, GraduationCap, Search, Filter } from 'lucide-react';
import { useState, useMemo } from 'react';
import { CreateClassForm } from '@/components/dashboard/adminDashboard/CreateClassForm';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CreateClassPageProps extends PageProps {
    classes: Array<{
        id: number;
        name: string;
        max_students: number;
        department: {
            id: number;
            name: string;
        };
        teachers?: Array<{
            id: number;
            user: {
                first_name: string;
                last_name: string;
                email: string;
            };
        }>;
        students?: Array<{
            id: number;
            user: {
                first_name: string;
                last_name: string;
            };
        }>;
    }>;
    departments: Department[];
    teachers: Teacher[];
}

export default function CreateClassPage() {
    const { classes = [], departments = [], teachers = [] } = usePage<CreateClassPageProps>().props;
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState<string>('all');

    const filteredClasses = useMemo(() => {
        return classes.filter(cls => {
            const matchesSearch = cls.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesDepartment = departmentFilter === 'all' || cls.department.id.toString() === departmentFilter;
            return matchesSearch && matchesDepartment;
        });
    }, [classes, searchTerm, departmentFilter]);

    return (
        <AppLayout>
            <div className="container mx-auto px-4 py-4 space-y-4">
                <div className="flex flex-col sm:flex-row gap-3 items-center w-full">
                    <div className="flex-1 flex gap-6 items-center w-full">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search classes..."
                                className="pl-10 pr-3 w-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-1 w-[200px]">
                            <Select 
                                value={departmentFilter}
                                onValueChange={setDepartmentFilter}
                            >
                                <SelectTrigger className="w-full">
                                    <div className="flex items-center gap-2">
                                        <Filter className="h-4 w-4 text-muted-foreground" />
                                        <SelectValue placeholder="All Depts" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Departments</SelectItem>
                                    {departments.map(dept => (
                                        <SelectItem key={dept.id} value={dept.id.toString()}>
                                            {dept.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <Button 
                        onClick={() => setIsCreateDialogOpen(true)} 
                        className="gap-2 sm:w-auto shrink-0"
                        size="sm"
                    >
                        <PlusIcon className="h-4 w-4" />
                        Create Class
                    </Button>
                </div>

                <Card className="mt-2">
                    <Table>
                        <TableCaption>A list of all classes in the system.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[200px]">Class Name</TableHead>
                                <TableHead>Department</TableHead>
                                <TableHead>Teachers</TableHead>
                                <TableHead>Students</TableHead>
                                <TableHead className="text-right">Capacity</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredClasses.length > 0 ? (
                                filteredClasses.map((cls) => (
                                    <TableRow key={cls.id} className="hover:bg-gray-50">
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                <GraduationCap className="h-5 w-5 text-primary" />
                                                {cls.name}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">
                                                {cls.department?.name || 'N/A'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                {cls.teachers?.slice(0, 3).map(teacher => (
                                                    <div key={teacher.id} className="flex items-center gap-2">
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarFallback>
                                                                {teacher.user.first_name.charAt(0)}{teacher.user.last_name.charAt(0)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <span className="text-sm">
                                                            {teacher.user.first_name} {teacher.user.last_name}
                                                        </span>
                                                    </div>
                                                ))}
                                                {(cls.teachers?.length ?? 0) > 3 && (
                                                    <div className="text-xs text-muted-foreground">
                                                        +{(cls.teachers?.length ?? 0) - 3} more
                                                    </div>
                                                )}
                                                {!cls.teachers?.length && (
                                                    <span className="text-xs text-muted-foreground">None</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Users className="h-4 w-4 text-muted-foreground" />
                                                <span>{cls.students?.length || 0}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <div className="w-full max-w-[120px]">
                                                    <div className="h-2 bg-gray-200 rounded-full">
                                                        <div 
                                                            className="h-2 bg-primary rounded-full" 
                                                            style={{
                                                                width: `${Math.min(100, ((cls.students?.length || 0) / cls.max_students) * 100)}%`
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <span className="text-sm text-muted-foreground">
                                                    {cls.students?.length || 0}/{cls.max_students}
                                                </span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        {classes.length === 0 
                                            ? "No classes found. Create your first class."
                                            : "No classes match your search criteria."}
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
                            onSuccess={() => {
                                setIsCreateDialogOpen(false);
                                window.location.reload();
                            }}
                        />
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}