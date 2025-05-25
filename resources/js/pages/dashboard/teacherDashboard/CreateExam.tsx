// import { CreateExamForm } from "@/components/dashboard/teacherDashboard/CreateExamForm"; // Ensure path is correct
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// import { usePage } from "@inertiajs/react"; // Import usePage
// import {  PageProps, ClassRoom, Teacher, CreateExamPageProps } from "@/types/index"; // Import necessary types
// import { AppLayout } from "@/layouts/dashboard/teacherDashboard/teacherDashboardLayout";

// export default function CreateExamPage() {
//   // Access the classes prop passed from the controller using usePage
//   const { classes } = usePage<CreateExamPageProps>().props;

//   return (
//     <AppLayout title="Create Exam"> {/* Set the title for the layout */}
//       <div className="space-y-6">
//         <Card className="border-border">
//           <CardHeader>
//             <CardTitle className="text-foreground text-2xl">Create New Exam</CardTitle>
//           </CardHeader>
//           <CardContent>
//             {/* Pass the classes prop down to the form component */}
//             <CreateExamForm classes={classes} />
//           </CardContent>
//         </Card>
//       </div>
//     </AppLayout>
//   );
// }
'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pencil, Trash2, PlusCircle, Search } from 'lucide-react';
import type { Test, ClassRoom } from '@/types/index';
import { Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AppLayout } from '@/layouts/dashboard/teacherDashboard/teacherDashboardLayout';
import { CreateExamDialog } from '@/components/dashboard/teacherDashboard/CreateExamDialog';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getTestStatus = (dueDate: string) => {
  const now = new Date();
  const due = new Date(dueDate);
  return due < now ? 'Past Due' : 
         (due.getTime() - now.getTime() < 24 * 60 * 60 * 1000 ? 'Due Soon' : 'Upcoming');
};

export default function CreateExamPage() {
  const { tests, classes } = usePage<{ tests: Test[], classes: ClassRoom[] }>().props;
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

   const filteredTests = (tests || []).filter(test => {
    const matchesSearch = test?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false;
    const matchesStatus = statusFilter === "all" || getTestStatus(test?.due_date) === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredTests.length / itemsPerPage);
  const paginatedTests = filteredTests.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleDelete = (testId: string) => {
    if (confirm('Are you sure you want to delete this test?')) {
      router.delete(`/teacher/tests/${testId}`);
    }
  };

  const handleCreateSuccess = () => {
    router.reload({ only: ['tests'] });
  };

  return (
    <AppLayout title="Exam Management">
      <div className="container mx-auto py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="relative w-full sm:w-1/2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search tests by title..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Select 
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Upcoming">Upcoming</SelectItem>
                <SelectItem value="Due Soon">Due Soon</SelectItem>
                <SelectItem value="Past Due">Past Due</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              onClick={() => setIsCreateDialogOpen(true)}
              className="ml-auto"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Exam
            </Button>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[30%]">Test Title</TableHead>
                <TableHead className="w-[20%]">Class</TableHead>
                <TableHead className="w-[20%]">Due Date</TableHead>
                <TableHead className="w-[15%]">Status</TableHead>
                <TableHead className="w-[15%] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
  {paginatedTests.length > 0 ? (
    paginatedTests.map((test) => {
      const status = getTestStatus(test.due_date);
      const statusColors = {
        'Upcoming': 'bg-yellow-100 text-yellow-800',
        'Due Soon': 'bg-orange-100 text-orange-800',
        'Past Due': 'bg-red-100 text-red-800'
      };

      return (
        <TableRow key={test.id}>
          {/* ... your table cells ... */}
        </TableRow>
      );
    })
  ) : (
    <TableRow>
      <TableCell colSpan={5} className="h-24 text-center">
        {filteredTests.length === 0 ? (
          tests?.length === 0 ? 'No tests available' : 'No matching tests found'
        ) : null}
      </TableCell>
    </TableRow>
  )}
</TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {paginatedTests.length} of {filteredTests.length} tests
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="text-sm">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        <CreateExamDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          classes={classes}
          onExamCreated={handleCreateSuccess}
        />
      </div>
    </AppLayout>
  );
}