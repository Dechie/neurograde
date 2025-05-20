import { TestList } from "@/components/dashboard/studentDashboard/TestList"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AppLayout } from "@/layouts/dashboard/studentDashboard/studentDashboardLayout"
import type { TestsPageProps } from "@/types/index"
import { usePage } from "@inertiajs/react"

export default function Tests() {
  // Get the tests from the page props
  const { tests } = usePage<TestsPageProps>().props

  return (
    <AppLayout title="Test">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Test List</CardTitle>
            <p className="text-muted-foreground text-sm">View and manage your tests</p>
          </div>
        </CardHeader>
        <CardContent>
          <TestList tests={tests} />
        </CardContent>
      </Card>
    </AppLayout>
  )
}
