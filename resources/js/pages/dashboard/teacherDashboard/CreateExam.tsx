import { CreateExamForm } from "@/components/dashboard/teacherDashboard/ExamForm";
import { AppLayout } from "@/layouts/dashboard/dashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function CreateExamPage() {
  return (
    <AppLayout title="Create Exam">
      <div className="space-y-6">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground text-2xl">Create New Exam</CardTitle>
          </CardHeader>
          <CardContent>
            <CreateExamForm />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}