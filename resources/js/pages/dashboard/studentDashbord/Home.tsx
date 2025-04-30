import { QuickLinks } from "@/components/dashboard/studentDashboard/QuickLinks"
import { QuickStats } from "@/components/dashboard/studentDashboard/QuickStats"
import { RecentResult } from "@/components/dashboard/studentDashboard/RecentResult"
import { UpcomingTest } from "@/components/dashboard/studentDashboard/UpcomingTest"
import { WelcomeBanner } from "@/components/dashboard/studentDashboard/WelcomeBanner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AppLayout } from "@/layouts/dashboard/studentDashboard/studentDashboardLayout"


export default function Home() {
  return (
    <AppLayout title="Overview">
      <div className="space-y-6">
        <WelcomeBanner />

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <QuickStats />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Test</CardTitle>
            </CardHeader>
            <CardContent>
              <UpcomingTest />
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent>
              <QuickLinks />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Result</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentResult />
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
