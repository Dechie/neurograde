import { useState } from 'react';
import { AppLayout } from '@/layouts/dashboard/adminDashboard/AdminDashboardLayout';
import { Head } from '@inertiajs/react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from '@inertiajs/react';

interface Student {
    id: number;
    user: {
        name: string;
        email: string;
    };
    status: 'pending' | 'assigned';
}

interface Class {
    id: number;
    name: string;
    department: {
        id: number;
        name: string;
    };
}

interface Props {
    students: Student[];
    classes: Class[];
}

export default function UnassignedStudents({ students, classes }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        student_id: '',
        class_id: ''
    });

    const handleAssign = (studentId: number) => {
        setData('student_id', studentId.toString());
        post(route('admin.assign-student'), {
            onSuccess: () => {
                // Refresh the page to show updated list
                window.location.reload();
            }
        });
    };

    return (
        <AppLayout>
            <Head title="Unassigned Students" />
            <div className="container mx-auto py-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Unassigned Students</CardTitle>
                        <CardDescription>
                            Assign students to their respective classes
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {students.length === 0 ? (
                            <p className="text-center text-muted-foreground py-4">
                                No unassigned students found
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {students.map((student) => (
                                    <Card key={student.id} className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-medium">{student.user.name}</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {student.user.email}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <Select
                                                    value={data.class_id}
                                                    onValueChange={(value) => setData('class_id', value)}
                                                >
                                                    <SelectTrigger className="w-[200px]">
                                                        <SelectValue placeholder="Select a class" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {classes.map((class_) => (
                                                            <SelectItem key={class_.id} value={class_.id.toString()}>
                                                                {class_.name} ({class_.department.name})
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <Button
                                                    onClick={() => handleAssign(student.id)}
                                                    disabled={!data.class_id || processing}
                                                >
                                                    {processing ? 'Assigning...' : 'Assign'}
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
} 