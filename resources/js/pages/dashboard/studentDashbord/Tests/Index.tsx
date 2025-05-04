import { TestList } from "@/components/dashboard/studentDashboard/TestList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {AppLayout} from "@/layouts/dashboard/studentDashboard/studentDashboardLayout";

interface TestsProps {
  tests: Array<{
    id: number;
    title: string;
    due_date: string;
    status: string;
  }>;
}

export default function Tests({ tests }: TestsProps) {
  return (
    <AppLayout title="Test">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Test List</CardTitle>
            <p className="text-sm text-muted-foreground">View and manage your tests</p>
          </div>
        </CardHeader>
        <CardContent>
          <TestList tests={tests}/>
        </CardContent>
      </Card>
    </AppLayout>
  )
}
