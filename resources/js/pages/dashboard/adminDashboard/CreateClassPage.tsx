import { AppLayout } from "@/layouts/dashboard/adminDashboard/AdminDashboardLayout"; // Assuming this is your admin layout
import { CreateClassForm } from "@/components/dashboard/adminDashboard/CreateClassForm"; // Corrected path based on user clarification
import { PageProps } from "@/types"; // Assuming PageProps type

// Define the props expected by this page component
interface Props extends PageProps {
    // These props are passed from the showCreateClassPage controller method
    departments: any[]; // Assuming departments are passed
    teachers: any[]; // Assuming teachers are passed
}

// This is the page component that Inertia renders
export default function CreateClassPage({ departments, teachers }: Props) {
  // The props passed from the controller are automatically available here

  return (
    // Wrap the form component in your admin layout
    <AppLayout title="Create Class"> {/* Set the title for the layout */}
        {/* Pass the props received by the page component down to the form component */}
        <CreateClassForm departments={departments} teachers={teachers} />
    </AppLayout>
  );
}

// Note: The CreateClassForm component itself is in components/dashboard/adminDashboard/CreateClass.tsx
// This file (CreateClassPage.tsx) is the Inertia page component that uses the form component.
