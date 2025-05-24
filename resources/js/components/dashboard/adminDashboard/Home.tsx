import { Card, CardContent } from '@/components/ui/card';
import type { AdminHomePageProps } from '@/types';
import { usePage } from '@inertiajs/react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, Tooltip, XAxis, YAxis } from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00C49F'];

const HomePage = () => {
    const {
        authUser,
        studentPerDept = [],
        students = [],
        teachers = [],
        classes = [],
        assignedTeacherCount,
        unassignedTeacherCount,
        assignedStudentCount,
        unassignedStudentCount,
    } = usePage<AdminHomePageProps>().props;

    const totalStudents = students.length;
    const totalTeachers = teachers.length;
    const totalClasses = classes.length;

    const barData = [
        {
            name: 'Teachers',
            Assigned: assignedTeacherCount,
            Unassigned: unassignedTeacherCount,
        },
        {
            name: 'Students',
            Assigned: assignedStudentCount,
            Unassigned: unassignedStudentCount,
        },
    ];

    return (
        <div className="space-y-6 p-6">
            {/* Welcome Banner */}
            <div className="bg-primary text-primary-foreground rounded-lg p-6">
                <h1 className="text-2xl font-bold">Welcome back, {authUser?.name || '!'}</h1>
                <p>Here's an overview of your academic progress and upcoming tests.</p>
            </div>

            {/* Row: Pie Chart + Quick Links */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Pie Chart */}
                <Card>
                    <CardContent className="p-6">
                        <h2 className="mb-4 text-lg font-semibold">Students per Department</h2>
                        <PieChart width={300} height={250}>
                            <Pie data={studentPerDept} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                                {studentPerDept.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </CardContent>
                </Card>

                {/* Quick Links */}
                <div className="grid grid-cols-2 gap-4">
                    <Card className="bg-blue-100 p-4 text-center transition hover:bg-blue-200">
                        <p className="font-semibold">Manage Students</p>
                    </Card>
                    <Card className="bg-green-100 p-4 text-center transition hover:bg-green-200">
                        <p className="font-semibold">Manage Teachers</p>
                    </Card>
                    <Card className="bg-purple-100 p-4 text-center transition hover:bg-purple-200">
                        <p className="font-semibold">Manage Classes</p>
                    </Card>
                    <Card className="bg-yellow-100 p-4 text-center transition hover:bg-yellow-200">
                        <p className="font-semibold">Department Overview</p>
                    </Card>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <Card className="p-6 text-center">
                    <p className="text-sm text-gray-500">Total Students</p>
                    <p className="text-2xl font-bold">{totalStudents}</p>
                </Card>
                <Card className="p-6 text-center">
                    <p className="text-sm text-gray-500">Total Teachers</p>
                    <p className="text-2xl font-bold">{totalTeachers}</p>
                </Card>
                <Card className="p-6 text-center">
                    <p className="text-sm text-gray-500">Total Classes</p>
                    <p className="text-2xl font-bold">{totalClasses}</p>
                </Card>
            </div>

            {/* Bar Chart */}
            <Card>
                <CardContent className="p-6">
                    <h2 className="mb-4 text-lg font-semibold">Assignment Status</h2>
                    <BarChart width={500} height={300} data={barData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Assigned" fill="#4ade80" />
                        <Bar dataKey="Unassigned" fill="#f87171" />
                    </BarChart>
                </CardContent>
            </Card>
        </div>
    );
};

export default HomePage;
