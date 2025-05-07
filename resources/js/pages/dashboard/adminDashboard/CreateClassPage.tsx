import { CreateClassForm } from "@/components/dashboard/adminDashboard/CreateClass";
import {TeacherSignupForm }from "@/components/dashboard/adminDashboard/TeacherRegister";
import { AppLayout } from "@/layouts/dashboard/adminDashboard/AdminDashboardLayout";
import { TypeOf, ZodObject, ZodString, ZodNumber, ZodTypeAny } from "zod";

export default function CreateClassPage() {
  return (
    <AppLayout title="Create Class">
        <CreateClassForm/>
          {/* <TeacherSignupForm/> */}
    </AppLayout>
  );
}