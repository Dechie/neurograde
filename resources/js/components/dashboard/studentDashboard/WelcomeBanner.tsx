import { Button } from "@/components/ui/button";
interface WelcomeBannerProps {
  userName: string;
}

export function WelcomeBanner({ userName }: WelcomeBannerProps) {
  return (
    <div className="rounded-lg bg-primary p-6 text-primary-foreground">
      <h1 className="text-2xl font-bold">Welcome back, {userName}!</h1>
      <p>Here's an overview of your academic progress and upcoming tests.</p>
    </div>
  );
}

// UpcomingTest.tsx
interface UpcomingTestProps {
  tests?: Array<{
    id: number;
    title: string;
    date: string;
    // other test properties
  }>;
}

export function UpcomingTest({ tests = [] }: UpcomingTestProps) {
  if (tests.length === 0) {
    return (
      <div className="rounded-lg border p-6 text-center">
        <p className="text-muted-foreground">No upcoming tests</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {tests.map(test => (
        <div key={test.id} className="flex items-center justify-between rounded-lg border p-4">
          <div>
            <h3 className="font-medium">{test.title}</h3>
            <p className="text-sm text-muted-foreground">{test.date}</p>
          </div>
          <Button variant="outline" size="sm">View Details</Button>
        </div>
      ))}
    </div>
  );
}

// Similar updates for RecentResult.tsx and other components