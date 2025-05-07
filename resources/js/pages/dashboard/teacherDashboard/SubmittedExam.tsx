import { SubmittedExams } from "@/components/dashboard/teacherDashboard/SubmittedExams";
import { AppLayout } from "@/layouts/dashboard/studentDashboard/StudentDashboardLayout";

export default function TeacherSubmittedExamsPage() {
  return (
    <AppLayout title="Submitted Exams">
      <SubmittedExams />
    </AppLayout>
  );
}