import { usePage } from '@inertiajs/react';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import type { AdminHomePageProps } from '@/types';

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
      <div className="rounded-lg bg-primary p-6 text-primary-foreground">
        <h1 className="text-2xl font-bold">Welcome back, {authUser?.name || '!'}</h1>
        <p>Here's an overview of your academic progress and upcoming tests.</p>
      </div>

      {/* Row: Pie Chart + Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Students per Department</h2>
            <PieChart width={300} height={250}>
              <Pie
                data={studentPerDept}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label
              >
                {studentPerDept.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-blue-100 hover:bg-blue-200 transition p-4 text-center">
            <p className="font-semibold">Manage Students</p>
          </Card>
          <Card className="bg-green-100 hover:bg-green-200 transition p-4 text-center">
            <p className="font-semibold">Manage Teachers</p>
          </Card>
          <Card className="bg-purple-100 hover:bg-purple-200 transition p-4 text-center">
            <p className="font-semibold">Manage Classes</p>
          </Card>
          <Card className="bg-yellow-100 hover:bg-yellow-200 transition p-4 text-center">
            <p className="font-semibold">Department Overview</p>
          </Card>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center p-6">
          <p className="text-sm text-gray-500">Total Students</p>
          <p className="text-2xl font-bold">{totalStudents}</p>
        </Card>
        <Card className="text-center p-6">
          <p className="text-sm text-gray-500">Total Teachers</p>
          <p className="text-2xl font-bold">{totalTeachers}</p>
        </Card>
        <Card className="text-center p-6">
          <p className="text-sm text-gray-500">Total Classes</p>
          <p className="text-2xl font-bold">{totalClasses}</p>
        </Card>
      </div>

      {/* Bar Chart */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Assignment Status</h2>
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
