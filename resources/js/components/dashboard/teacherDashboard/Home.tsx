import { AppLayout } from "@/layouts/dashboard/teacherDashboard/teacherDashboardLayout";
import { Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { PlusCircle, BookOpen, FileText, Clock, GraduationCap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import type {TeacherHomeProps } from "@/types";

ChartJS.register(...registerables);

export default function TeacherDashboard({
  user,
  recentTests,
  pendingSubmissions,
  stats
}: TeacherHomeProps) {
  // Chart data for tests created over time
  const testsChartData = {
    labels: recentTests.map(test => test.title),
    datasets: [
      {
        label: 'Submissions',
        data: recentTests.map(test => test.submissions_count),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Graded',
        data: recentTests.map(test => test.graded_count),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      }
    ],
  };

  // Pie chart data for test status
  const statusChartData = {
    labels: ['Published', 'Draft', 'Graded'],
    datasets: [
      {
        data: [
          stats.total_tests - stats.pending_grading,
          stats.pending_grading,
          stats.total_submissions - stats.pending_grading
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 99, 132, 0.5)',
          'rgba(75, 192, 192, 0.5)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(75, 192, 192, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <AppLayout title="Teacher Dashboard">
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="bg-primary text-primary-foreground rounded-lg p-6">
          <h1 className="text-2xl font-bold">Welcome back, {user.name}</h1>
          <p className="text-muted-foreground">Email: {user.email}</p>
          <p>Here's an overview of your teaching activities.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Tests
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_tests}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Submissions
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_submissions}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Grading
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending_grading}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Classes
              </CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.classes}</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Test Submissions Overview</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <Bar 
                data={testsChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                }}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Test Status Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <Pie 
                data={statusChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </CardContent>
          </Card>
        </div>

        {/* Recent Tests */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Tests</CardTitle>
              <Link href={route('teacher.tests.index')}>
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Submissions</TableHead>
                  <TableHead>Graded</TableHead>
                  <TableHead>Published</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTests.map((test) => (
                  <TableRow key={test.id}>
                    <TableCell className="font-medium">{test.title}</TableCell>
                    <TableCell>{test.class}</TableCell>
                    <TableCell>{test.due_date}</TableCell>
                    <TableCell>{test.submissions_count}</TableCell>
                    <TableCell>{test.graded_count}</TableCell>
                    <TableCell>{test.published_count}</TableCell>
                    <TableCell className="text-right">
                      <Link href={route('teacher.tests.show', test.id)}>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Link href={route('teacher.tests.create')}>
            <Card className="hover:bg-accent cursor-pointer transition-colors">
              <CardHeader className="flex flex-row items-center space-x-4">
                <PlusCircle className="h-6 w-6" />
                <CardTitle>Create New Test</CardTitle>
              </CardHeader>
            </Card>
          </Link>
          <Link href={route('teacher.tests.index')}>
            <Card className="hover:bg-accent cursor-pointer transition-colors">
              <CardHeader className="flex flex-row items-center space-x-4">
                <FileText className="h-6 w-6" />
                <CardTitle>Grade Submissions</CardTitle>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}