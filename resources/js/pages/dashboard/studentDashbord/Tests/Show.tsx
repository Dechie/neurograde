import { CodeEditor } from "@/components/dashboard/studentDashboard/CodeEditor";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AppLayout } from "@/layouts/dashboard/studentDashboard/StudentDashboardLayout";
import { Test } from "@/types/student-dashboard"; // Import the Test type

interface TestDetailProps {
  test: Test; // Accept a Test object as a prop
}

export default function TestDetail({ test }: TestDetailProps) {
  return (
    <AppLayout title="Test">
      <div className="grid gap-1 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{test.title}</CardTitle> {/* Use test.title */}
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p className="text-black">
             {test.problemStatement} 
            </p>
          </CardContent>
          <CardFooter className="border-t mt-auto p-1">
            <p className="text-sm text-muted-foreground">Due Date: {test.dueDate || test.dueDate}</p> {/* Use test.due_date */}
          </CardFooter>
        </Card>

        <div>
          <CodeEditor />
        </div>
      </div>
    </AppLayout>
  );
}
