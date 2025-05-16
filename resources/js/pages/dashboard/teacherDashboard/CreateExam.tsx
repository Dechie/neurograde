import { CreateExamForm } from "@/components/dashboard/teacherDashboard/ExamForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppLayout } from "@/layouts/dashboard/teacherDashboard/teacherDashoboardLayout";

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