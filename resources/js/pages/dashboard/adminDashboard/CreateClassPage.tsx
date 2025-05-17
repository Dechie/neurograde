import { CreateClassForm } from '@/components/dashboard/adminDashboard/CreateClassForm'; // Corrected path
import { AppLayout } from '@/layouts/dashboard/adminDashboard/AdminDashboardLayout';
// Import the specific PageProps interface from your types file
import { CreateClassPageProps } from '@/types'; // Import from types file

// The page component now uses the specific PageProps interface from types.d.ts
export default function CreateClassPage({ departments, teachers }: CreateClassPageProps) {
    // departments and teachers are available directly from the props
    return (
        <AppLayout title="Create Class">
            {/* Pass the props down to the form component */}
            <CreateClassForm departments={departments} teachers={teachers} />
        </AppLayout>
    );
}
