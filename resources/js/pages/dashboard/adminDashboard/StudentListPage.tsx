import StudentList from "@/components/dashboard/adminDashboard/StudentList";
import { AppLayout } from "@/layouts/dashboard/adminDashboard/AdminDashboardLayout";

export default function CreateClassPage() {
  return (
    <AppLayout title="Teacher List">
        <StudentList/>
    </AppLayout>
  );
}