import { CreateClassForm } from '@/components/dashboard/adminDashboard/CreateClassForm'; // Corrected path
import { AppLayout } from '@/layouts/dashboard/adminDashboard/AdminDashboardLayout';
import { CreateClassPageProps } from '@/types';

export default function CreateClassPage({ departments, teachers }: CreateClassPageProps) {
    return (
        <AppLayout title="Create Class">
            <CreateClassForm departments={departments} />
        </AppLayout>
    );
}
