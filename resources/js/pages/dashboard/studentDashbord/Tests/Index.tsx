import { TestList } from "@/components/dashboard/studentDashboard/TestList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppLayout } from "@/layouts/dashboard/studentDashboard/studentDashboardLayout";

interface TestsProps {
  tests: Array<{
    id: number;
    title: string;
    due_date: string;
    status: string;
  }>;
}

// export default function Tests({ tests }: TestProps) {
//   return (
//     <AppLayout title="Test">
//       <Card>
//         <CardHeader className="flex flex-row items-center justify-between">
//           <div>
//             <CardTitle>Test List</CardTitle>
//             <p className="text-sm text-muted-foreground">View and manage your tests</p>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <TestList tests={tests}/>
//         </CardContent>
//       </Card>
//     </AppLayout>
//   )
// }

// In Tests/Index.tsx
export default function Tests({ tests }: TestsProps) {
  console.log('Tests props:', tests); // Add this to check if props are received
  
  return (
    <AppLayout title="Test">
      <div className="border-2 border-red-500 p-4"> {/* Add this to see if the content area is visible */}
        <Card className="border-2 border-blue-500"> {/* Add this to see if the Card is rendering */}
          <CardHeader className="flex flex-row items-center justify-between border-2 border-green-500">
            <div>
              <CardTitle>Test List</CardTitle>
              <p className="text-sm text-muted-foreground">View and manage your tests</p>
            </div>
          </CardHeader>
          <CardContent>
            <TestList tests={tests} />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}