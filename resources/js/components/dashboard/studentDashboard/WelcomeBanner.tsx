// export function WelcomeBanner() {
//   const currentDate = new Date().toLocaleDateString("en-US", {
//     month: "long",
//     day: "numeric",
//     year: "numeric",
//   })

import { Button } from "@/components/ui/button";

//   return (
//     <div className="relative overflow-hidden rounded-lg bg-primary p-6 text-primary-foreground">
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//         <div className="space-y-2">
//           <p className="text-sm">{currentDate}</p>
//           <h2 className="text-3xl font-bold">Welcome back, Name!</h2>
//           <p className="text-primary-foreground/80">Always stay updated in your student portal</p>
//         </div>
//         <div className="mt-4 md:mt-0">
//           <img
//             src="/placeholder.svg?height=150&width=150"
//             alt="Student avatar"
//             width={150}
//             height={150}
//             className="h-auto w-auto"
//           />
//         </div>
//       </div>

//       {/* Decorative elements */}
//       <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/2" />
//       <div className="absolute left-1/4 bottom-0 h-16 w-16 rounded-full bg-white/10 translate-y-1/2" />
//       <div className="absolute right-1/3 top-1/3 h-8 w-8 rounded-full bg-white/10" />
//     </div>
//   )
// }
// WelcomeBanner.tsx
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