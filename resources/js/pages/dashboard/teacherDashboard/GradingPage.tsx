import { GradingPage } from "@/components/dashboard/teacherDashboard/Grading";
import { AppLayout } from "@/layouts/dashboard/dashboardLayout";

export default function TeacherGradingPage() {
  return (
    <AppLayout title="Grade Submissions">
      <GradingPage />
    </AppLayout>
  );
}