import { ResultsOverview } from "@/components/dashboard/studentDashboard/RecentOverview"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
//import { AppLayout } from "@/layouts/dashboard/studentDashboard/StudentDashboardLayout"
import { AppLayout } from "@/layouts/dashboard/studentDashboard/studentDashboardLayout"

export default function Results() {
  return (
    <AppLayout title="Result">
      <div className="space-y-6 w-full max-w-full">
        <Card className="w-full max-w-full">
          <CardHeader>
            <CardTitle>Results Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResultsOverview />
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2 w-full max-w-full">
          <Card>
            <CardHeader>
              <CardTitle>Recent Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border p-6 text-center">
                <p className="text-muted-foreground">No recent test results available</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border p-6 text-center">
                <p className="text-muted-foreground">No performance metrics available</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
