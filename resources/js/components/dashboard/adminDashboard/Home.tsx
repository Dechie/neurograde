import { Card, CardContent } from '@/components/ui/card';
import type { AdminHomePageProps } from '@/types';
import { usePage } from '@inertiajs/react';
import { Bar, BarChart, CartesianGrid, Cell, LabelList, Legend, Pie, PieChart, Tooltip, XAxis, YAxis } from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00C49F'];

type DepartmentData = {
    name: string;
    value: number;
};

export default function HomePage() {
    const { props } = usePage<AdminHomePageProps>();
    const {
        studentPerDept = [],
        students = [],
        teachers = [],
        classes = [],
        assignedTeacherCount = 0,
        unassignedTeacherCount = 0,
        assignedStudentCount = 0,
        unassignedStudentCount = 0,
    } = props || {};

    const departmentData: DepartmentData[] = Array.isArray(studentPerDept)
        ? studentPerDept
              .filter((item): item is { name: string; value: number } => 
                  item != null && typeof item === 'object' && 'name' in item && 'value' in item
              )
              .map(item => ({
                  name: String(item.name),
                  value: Number(item.value) || 0,
              }))
        : [];

    const totalStudents = Array.isArray(students) ? students.length : 0;
    const totalTeachers = Array.isArray(teachers) ? teachers.length : 0;
    const totalClasses = Array.isArray(classes) ? classes.length : 0;

    const stats = {
        totalStudents,
        totalTeachers,
        totalClasses,
    };

    const barData = [
        {
            name: 'Teachers',
            Assigned: Number(assignedTeacherCount) || 0,
            Unassigned: Number(unassignedTeacherCount) || 0,
        },
        {
            name: 'Students',
            Assigned: Number(assignedStudentCount) || 0,
            Unassigned: Number(unassignedStudentCount) || 0,
        },
    ];

    return (
        <div className="space-y-6 p-6">
            <div className="bg-primary text-primary-foreground rounded-lg p-6">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p>Here's an overview of your academic progress and upcoming tests.</p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <Card className="p-6 text-center">
                    <p className="text-sm text-gray-500">Total Students</p>
                    <p className="text-2xl font-bold">{stats.totalStudents}</p>
                </Card>
                <Card className="p-6 text-center">
                    <p className="text-sm text-gray-500">Total Teachers</p>
                    <p className="text-2xl font-bold">{stats.totalTeachers}</p>
                </Card>
                <Card className="p-6 text-center">
                    <p className="text-sm text-gray-500">Total Classes</p>
                    <p className="text-2xl font-bold">{stats.totalClasses}</p>
                </Card>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardContent className="p-6">
                        <h2 className="mb-4 text-lg font-semibold">Students per Department</h2>
                        {departmentData.length > 0 ? (
                            <PieChart width={300} height={250}>
                                <Pie
                                    data={departmentData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                >
                                    {departmentData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => [`${value} students`, 'Count']} />
                            </PieChart>
                        ) : (
                            <p className="text-center text-gray-500">No department data available</p>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <h2 className="mb-4 text-lg font-semibold">Assignment Status</h2>
                        <BarChart width={350} height={200} data={barData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis allowDecimals={false} />
                            <Bar dataKey="Assigned" fill="#4ade80" name="Assigned">
                                <LabelList dataKey="Assigned" position="top" />
                            </Bar>
                            <Bar dataKey="Unassigned" fill="#f87171" name="Unassigned">
                                <LabelList dataKey="Unassigned" position="top" />
                            </Bar>
                        </BarChart>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};