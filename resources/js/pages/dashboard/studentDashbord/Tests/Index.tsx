import { TestList } from "@/components/dashboard/studentDashboard/TestList"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AppLayout } from "@/layouts/dashboard/dashboardLayout"

export default function Tests() {
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
          <TestList />
        </CardContent>
      </Card>
    </AppLayout>
  )
}
