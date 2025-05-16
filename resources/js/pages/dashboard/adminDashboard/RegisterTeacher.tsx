import {TeacherSignupForm }from "@/components/dashboard/adminDashboard/TeacherRegister";
import { AppLayout } from "@/layouts/dashboard/adminDashboard/AdminDashboardLayout";

export default function CreateClassPage() {
  return (
    <AppLayout title="Register Teacher">
          <TeacherSignupForm/>
    </AppLayout>
  );
}