import { GradingPage } from "@/components/dashboard/teacherDashboard/Grading";
import { AppLayout } from "@/layouts/dashboard/studentDashboard/StudentDashboardLayout";

export default function TeacherGradingPage() {
  return (
    <AppLayout title="Grade Submissions">
      <GradingPage />
    </AppLayout>
  );
}