import UnassignedStudentList from '@/components/dashboard/adminDashboard/UnassignedStudentList';

import { AppLayout } from '@/layouts/dashboard/adminDashboard/AdminDashboardLayout';

export default function UnassignedStudentsPage(props: any) {
    return (
        <AppLayout title="Unassigned Students">
            <UnassignedStudentList {...props} />
        </AppLayout>
    );
}
