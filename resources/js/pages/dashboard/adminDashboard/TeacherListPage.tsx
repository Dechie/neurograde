import { CreateClassForm } from "@/components/dashboard/adminDashboard/CreateClass";
import TeacherList from "@/components/dashboard/adminDashboard/TeacherList";
import {TeacherSignupForm }from "@/components/dashboard/adminDashboard/TeacherRegister";
import { AppLayout } from "@/layouts/dashboard/adminDashboard/AdminDashboardLayout";
import { TypeOf, ZodObject, ZodString, ZodNumber, ZodTypeAny } from "zod";

export default function CreateClassPage() {
  return (
    <AppLayout title="Teacher List">
        <TeacherList/>
    </AppLayout>
  );
}