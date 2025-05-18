import { CreateExamForm } from "@/components/dashboard/teacherDashboard/CreateExamForm"; // Ensure path is correct
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppLayout } from "@/layouts/dashboard/teacherDashboard/teacherDashoboardLayout"; // Ensure path is correct
import { usePage } from "@inertiajs/react"; // Import usePage
import {  PageProps, ClassRoom, Teacher, CreateExamPageProps } from "@/types/index"; // Import necessary types

export default function CreateExamPage() {
  // Access the classes prop passed from the controller using usePage
  const { classes } = usePage<CreateExamPageProps>().props;

  return (
    <AppLayout title="Create Exam"> {/* Set the title for the layout */}
      <div className="space-y-6">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground text-2xl">Create New Exam</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Pass the classes prop down to the form component */}
            <CreateExamForm classes={classes} />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
