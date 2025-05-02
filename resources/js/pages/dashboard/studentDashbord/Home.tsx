import { QuickLinks } from "@/components/dashboard/studentDashboard/QuickLinks"
import { QuickStats } from "@/components/dashboard/studentDashboard/QuickStats"
import { RecentResult } from "@/components/dashboard/studentDashboard/RecentResult"
import { UpcomingTest } from "@/components/dashboard/studentDashboard/UpcomingTest"
import { WelcomeBanner } from "@/components/dashboard/studentDashboard/WelcomeBanner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StudentDashboardLayout } from "@/layouts/dashboard/studentDashboard/studentDashboardLayout"

interface HomeProps {
  user: {
    id: number;
    name: string;
    email: string;
    student: {
      id_number: string;
      academic_year: string;
      department: string;
    }
  };
  upcomingTests: Array<{
    id: number;
    title: string;
    date: string;
    // other test properties
  }>;
  recentResults: Array<{
    id: number;
    test: {
      title: string;
    };
    score: number;
    // other result properties
  }>;
}

export default function Home({ user, upcomingTests, recentResults }: HomeProps) {
  console.log('Home props:', { user, upcomingTests, recentResults });
  return (
    <StudentDashboardLayout title="Overview">
      <div className="space-y-6">
        <div className="border border-red-500 bg-yellow-200">
          <WelcomeBanner userName={user.name} />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <QuickStats 
                student={user.student} 
                resultCount={recentResults.length} 
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Test</CardTitle>
            </CardHeader>
            <CardContent>
              <UpcomingTest tests={upcomingTests} />
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
              <RecentResult results={recentResults} />
            </CardContent>
          </Card>
        </div>
      </div>
    </StudentDashboardLayout>
  )
}