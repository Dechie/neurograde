import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
// In components/dashboard/studentDashboard/UpcomingTest.tsx
import React from "react";
import { Button } from "@/components/ui/button";

// Define the props interface
interface UpcomingTestProps {
  tests?: Array<{
    id: number;
    title: string;
    date: string;
    // Add other properties as needed
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